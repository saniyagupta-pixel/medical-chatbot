from flask import Flask, jsonify, request
from src.helper import download_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from src.prompt import *
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os

app = Flask(__name__)

load_dotenv()

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

rag_chain = None

def get_rag_chain():
    global rag_chain

    if rag_chain is None:
        pinecone_api_key = os.getenv("PINECONE_API_KEY")
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not pinecone_api_key or not groq_api_key:
            raise RuntimeError("PINECONE_API_KEY and GROQ_API_KEY must be configured")

        embedding = download_embeddings()

        docsearch = PineconeVectorStore.from_existing_index(
            index_name="medical-chatbot",
            embedding=embedding
        )

        retriever = docsearch.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )

        llm = ChatGroq(
            groq_api_key=groq_api_key,
            model_name=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
        )

        question_answer_chain = create_stuff_documents_chain(
            llm,
            prompt
        )

        rag_chain = create_retrieval_chain(
            retriever,
            question_answer_chain
        )

    return rag_chain

@app.route("/")
def home():
    return "Medical Chatbot API is running 🚀"

@app.route("/chat", methods=["POST"])
def chat():
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

    try:
        chain = get_rag_chain()

        response = chain.invoke({
            "input": message.strip(),
            "question": message.strip(),
            "chat_history": history_text
        })
    except RuntimeError as error:
        app.logger.error("Chatbot configuration error: %s", error)
        return jsonify({"message": "The chatbot service is not configured"}), 503
    except Exception:
        app.logger.exception("Chatbot request failed")
        return jsonify({"message": "The chatbot could not answer right now"}), 502

    answer = response.get("answer") if isinstance(response, dict) else None
    if not isinstance(answer, str) or not answer.strip():
        app.logger.error("Chatbot chain returned no answer")
        return jsonify({"message": "The chatbot returned an empty response"}), 502
    return jsonify({
        "reply": answer.strip()
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)