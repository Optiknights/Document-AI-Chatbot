const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || 'qwen3:8b';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

async function ollamaFetch(path, payload) {
  const response = await fetch(`${OLLAMA_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${errorText}`);
  }

  return response.json();
}

export async function createEmbeddings(input) {
  const data = await ollamaFetch('/api/embed', {
    model: OLLAMA_EMBED_MODEL,
    input
  });

  return data.embeddings || [];
}

export async function createChatCompletion(messages) {
  const data = await ollamaFetch('/api/chat', {
    model: OLLAMA_CHAT_MODEL,
    stream: false,
    messages,
    options: {
      temperature: 0.2
    }
  });

  return data?.message?.content || 'I could not generate a response.';
}

export function getOllamaConfig() {
  return {
    baseUrl: OLLAMA_BASE_URL,
    chatModel: OLLAMA_CHAT_MODEL,
    embedModel: OLLAMA_EMBED_MODEL
  };
}
