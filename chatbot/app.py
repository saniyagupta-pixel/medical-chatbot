from flask import Flask, jsonify, request
from src.helper import download_embeddings, format_docs, get_retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from src.prompt import *
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os
import logging
from pathlib import Path
from time import perf_counter
from uuid import uuid4

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# -----------------------------
# Initialize only lightweight objects
# -----------------------------

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

retriever = None
question_answer_chain = None

def get_rag_components():
    global retriever, question_answer_chain

    if retriever is None or question_answer_chain is None:
        if not PINECONE_API_KEY or not GROQ_API_KEY:
            raise RuntimeError("PINECONE_API_KEY and GROQ_API_KEY must be configured")

        app.logger.info("RAG initialization: loading embedding model")
        started_at = perf_counter()
        embedding = download_embeddings()
        app.logger.info(
            "RAG initialization: embedding model loaded in %.2f seconds",
            perf_counter() - started_at,
        )

        app.logger.info("RAG initialization: connecting to Pinecone index")
        started_at = perf_counter()
        retriever = get_retriever(
            embedding,
            index_name="medical-chatbot",
            api_key=PINECONE_API_KEY,
            k=3,
        )
        app.logger.info(
            "RAG initialization: Pinecone retriever ready in %.2f seconds",
            perf_counter() - started_at,
        )

        app.logger.info("RAG initialization: creating Groq answer chain")
        llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
        )

        # Replaces langchain.chains.create_stuff_documents_chain (moved to
        # langchain-classic in LangChain 1.0): format docs -> prompt -> LLM -> str
        question_answer_chain = (
            RunnablePassthrough.assign(context=lambda x: format_docs(x["context"]))
            | prompt
            | llm
            | StrOutputParser()
        )
        app.logger.info("RAG initialization: answer chain ready")

    return retriever, question_answer_chain

@app.route("/")
def home():
    return "Medical Chatbot API is running 🚀"

@app.route("/healthz")
def health():
    return jsonify({
        "status": "ok",
        "rag_initialized": retriever is not None and question_answer_chain is not None,
    })

@app.route("/chat", methods=["POST"])
def chat():
    request_id = uuid4().hex[:12]
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Send a JSON request body"}), 400

    message = data.get("message")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"message": "Enter a message before sending"}), 400
    if len(message) > 10000:
        return jsonify({"message": "Message is too long"}), 400

    history = data.get("chathistory", [])
    if not isinstance(history, list):
        return jsonify({"message": "Chat history must be a list"}), 400

    history_text = ""
    for msg in history[-20:]:
        if (
            not isinstance(msg, dict)
            or msg.get("role") not in {"user", "bot", "assistant"}
            or not isinstance(msg.get("content"), str)
        ):
            return jsonify({"message": "Chat history contains an invalid message"}), 400
        history_text += f"{msg['role']}: {msg['content']}\n"

    stage = "initialization"
    try:
        app.logger.info("Chat %s: request received", request_id)
        rag_retriever, answer_chain = get_rag_components()

        stage = "Pinecone retrieval"
        app.logger.info("Chat %s: starting Pinecone retrieval", request_id)
        started_at = perf_counter()
        documents = rag_retriever.invoke(message.strip())
        app.logger.info(
            "Chat %s: Pinecone retrieval returned %d documents in %.2f seconds",
            request_id,
            len(documents),
            perf_counter() - started_at,
        )

        stage = "Groq generation"
        app.logger.info("Chat %s: starting Groq generation", request_id)
        started_at = perf_counter()
        answer = answer_chain.invoke({
            "input": message.strip(),
            "question": message.strip(),
            "chat_history": history_text,
            "context": documents,
        })
        app.logger.info(
            "Chat %s: Groq generation completed in %.2f seconds",
            request_id,
            perf_counter() - started_at,
        )
    except RuntimeError:
        app.logger.exception("Chat %s: configuration error during %s", request_id, stage)
        return jsonify({"message": "The chatbot service is not configured"}), 503
    except Exception:
        app.logger.exception("Chat %s: failed during %s", request_id, stage)
        return jsonify({"message": "The chatbot could not answer right now"}), 502

    if not isinstance(answer, str) or not answer.strip():
        app.logger.error("Chat %s: answer chain returned no answer", request_id)
        return jsonify({"message": "The chatbot returned an empty response"}), 502

    return jsonify({
        "reply": answer.strip()
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)