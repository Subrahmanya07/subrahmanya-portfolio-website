"""
One-time script to seed the MongoDB Atlas vector store with resume chunks.

Usage:
  1. Set MONGO_URI and GOOGLE_API_KEY in .env
  2. Run: python api/data/seed_vectors.py
  3. Create a Vector Search index in MongoDB Atlas on rag_db.documents
"""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

import google.generativeai as genai
from pymongo import MongoClient


def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")

    if not api_key:
        print("Error: GOOGLE_API_KEY not set in .env")
        return

    if not mongo_uri:
        print("Error: MONGO_URI not set in .env")
        return

    genai.configure(api_key=api_key)

    # Load chunks
    chunks_path = os.path.join(os.path.dirname(__file__), "resume_chunks.json")
    with open(chunks_path) as f:
        chunks = json.load(f)

    print(f"Loaded {len(chunks)} chunks")

    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client[os.getenv("MONGODB_RAG_DB", "rag_db")]
    collection = db.documents

    # Clear existing documents
    collection.delete_many({})
    print("Cleared existing documents")

    # Generate embeddings and insert
    for i, chunk in enumerate(chunks):
        print(f"Processing chunk {i + 1}/{len(chunks)}: {chunk['metadata']['title']}")

        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=chunk["text"],
        )

        doc = {
            "text": chunk["text"],
            "category": chunk["category"],
            "embedding": result["embedding"],
            "metadata": chunk["metadata"],
        }

        collection.insert_one(doc)

    print(f"\nSeeded {len(chunks)} documents into rag_db.documents")
    print("\nNext steps:")
    print("1. Go to MongoDB Atlas > Database > rag_db > documents")
    print("2. Create a Vector Search Index with this config:")
    print(
        json.dumps(
            {
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding",
                        "numDimensions": 3072,
                        "similarity": "cosine",
                    }
                ]
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
