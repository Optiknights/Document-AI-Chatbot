const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/api/upload', {
    method: 'POST',
    body: formData
  });
}

export async function askDocumentQuestion(payload) {
  return request('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export { API_BASE_URL };
