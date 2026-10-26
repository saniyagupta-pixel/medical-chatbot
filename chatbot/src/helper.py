from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from uuid import uuid4

from langchain_core.documents import Document
from langchain_core.runnables import RunnableLambda
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone


def load_pdf_files(data: str) -> list[Document]:
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader,
    )
    return loader.load()


# Document is a class (data structure) used in LangChain to store text along with metadata.
def filter_to_minimal_docs(docs: list[Document]) -> list[Document]:
    minimal_docs: list[Document] = []
    for doc in docs:
        src = doc.metadata.get("source")
        minimal_docs.append(
            Document(
                page_content=doc.page_content,
                metadata={"source": src},
            )
        )
    return minimal_docs


def text_split(minimal_docs: list[Document]) -> list[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20,
    )
    return text_splitter.split_documents(minimal_docs)


def download_embeddings() -> HuggingFaceEmbeddings:
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    return HuggingFaceEmbeddings(model_name=model_name)


def format_docs(docs: list[Document]) -> str:
    """Join retrieved documents into one context string for the prompt."""
    return "\n\n".join(doc.page_content for doc in docs)


# --- Pinecone helpers -------------------------------------------------------
# langchain-pinecone is capped at Python < 3.14 on PyPI, so we use the official
# `pinecone` client directly. The storage layout (vector values + metadata with
# the chunk text under the "text" key) matches langchain-pinecone, so an index
# created earlier with it keeps working.

TEXT_KEY = "text"


def upsert_documents(
    docs: list[Document],
    embedding: HuggingFaceEmbeddings,
    index_name: str,
    api_key: str,
    batch_size: int = 100,
) -> None:
    index = Pinecone(api_key=api_key).Index(index_name)
    for start in range(0, len(docs), batch_size):
        batch = docs[start : start + batch_size]
        vectors = embedding.embed_documents([d.page_content for d in batch])
        index.upsert(
            vectors=[
                {
                    "id": uuid4().hex,
                    "values": vector,
                    "metadata": {**d.metadata, TEXT_KEY: d.page_content},
                }
                for d, vector in zip(batch, vectors, strict=True)
            ]
        )


def get_retriever(
    embedding: HuggingFaceEmbeddings,
    index_name: str,
    api_key: str,
    k: int = 3,
) -> RunnableLambda:
    """Return a runnable: query string -> list[Document] (top-k by similarity)."""
    index = Pinecone(api_key=api_key).Index(index_name)

    def retrieve(query: str) -> list[Document]:
        result = index.query(
            vector=embedding.embed_query(query),
            top_k=k,
            include_metadata=True,
        )
        docs = []
        for match in result.matches:
            metadata = dict(match.metadata or {})
            text = metadata.pop(TEXT_KEY, "")
            docs.append(Document(page_content=text, metadata=metadata))
        return docs

    return RunnableLambda(retrieve)
