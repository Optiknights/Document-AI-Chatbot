# Document AI ChatBot with Ollama

A full-stack PDF chat application with a clean UI

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- LLM runtime: Ollama
- PDF parsing: pdf-parse
- Retrieval: local chunking + embeddings + cosine similarity

## Features
- Upload PDF documents
- Preview the uploaded PDF in-app
- Ask questions in a right-side chat panel
- Retrieve relevant snippets from the document before generating answers
- Use Ollama locally for both chat and embeddings
- Clean blue-and-white UI

## Project Structure
- `frontend/` React UI
- `backend/` Express API, PDF ingestion, retrieval, Ollama integration

## Quick Start

### 1) Start Ollama and pull models
```bash
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

### 2) Configure backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Configure frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev -- --host 0.0.0.0
```

### 4) Open the app
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/api/health`

## Default Environment Values
### Backend `.env`
```env
PORT=4000
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=qwen3:8b
OLLAMA_EMBED_MODEL=nomic-embed-text
CHUNK_SIZE=900
CHUNK_OVERLAP=160
TOP_K=5
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:4000
```

## Notes
- This project stores indexed document chunks in memory for simplicity.
- Uploaded PDF files are saved in `backend/uploads/`.
- For production use, swap the in-memory document store for a database or vector store.
