from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load FAQ data
with open('faqs.json', 'r') as f:
    faq_data = json.load(f)

# Flatten the FAQ data
all_faqs = []
for category, questions in faq_data.items():
    for item in questions:
        all_faqs.append({
            'category': category,
            'question': item['question'],
            'answer': item['answer']
        })

# Initialize the sentence transformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Initialize ChromaDB
chroma_client = chromadb.Client(Settings(anonymized_telemetry=False))

# Create or get the collection
collection = chroma_client.get_or_create_collection(name="faq_collection")

# Add documents to the collection
collection.add(
    documents=[faq['question'] for faq in all_faqs],
    metadatas=[{'category': faq['category'], 'answer': faq['answer']} for faq in all_faqs],
    ids=[str(i) for i in range(len(all_faqs))]
)

class Query(BaseModel):
    query: str

@app.post("/search")
async def search_faqs(query: Query):
    # Encode the query
    query_embedding = model.encode(query.query).tolist()
    
    # Search the collection
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )
    
    # Format the results
    formatted_results = []
    for i in range(len(results['ids'][0])):
        formatted_results.append({
            'category': results['metadatas'][0][i]['category'],
            'question': results['documents'][0][i],
            'answer': results['metadatas'][0][i]['answer'],
            'similarity': 1 - results['distances'][0][i]  # Convert distance to similarity
        })
    
    # Sort results by similarity score in descending order
    formatted_results.sort(key=lambda x: x['similarity'], reverse=True)
    
    return formatted_results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)