import os
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

from src.helper import (
    download_embeddings,
    filter_to_minimal_docs,
    load_pdf_files,
    text_split,
    upsert_documents,
)

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY must be configured in .env")

extracted_data = load_pdf_files("data")
minimal_docs = filter_to_minimal_docs(extracted_data)
texts_chunk = text_split(minimal_docs)

embedding = download_embeddings()

pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "medical-chatbot"
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

upsert_documents(
    texts_chunk,
    embedding,
    index_name=index_name,
    api_key=PINECONE_API_KEY,
)
