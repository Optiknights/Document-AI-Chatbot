const documents = new Map();

export function saveDocument(doc) {
  documents.set(doc.id, doc);
  return doc;
}

export function getDocument(id) {
  return documents.get(id);
}

export function getAllDocuments() {
  return Array.from(documents.values()).map(({ chunks, ...rest }) => rest);
}
