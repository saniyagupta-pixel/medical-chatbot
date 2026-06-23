from flask import Flask, render_template, jsonify, request
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

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# -----------------------------
# Initialize only lightweight objects
# -----------------------------

llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.1-8b-instant"
)

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
        embedding = download_embeddings()

        docsearch = PineconeVectorStore.from_existing_index(
            index_name="medical-chatbot",
            embedding=embedding
        )

        retriever = docsearch.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
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


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    message = data.get("message")
    history = data.get("chathistory", [])

    history_text = ""
    for msg in history:
        history_text += f"{msg['role']}: {msg['content']}\n"

    chain = get_rag_chain()

    response = chain.invoke({
        "input": message,
        "question": message,
        "chat_history": history_text
    })

    return jsonify({
        "reply": response["answer"]
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)