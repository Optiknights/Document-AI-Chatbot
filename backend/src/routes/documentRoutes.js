import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parsePdf } from '../utils/pdf.js';
import { chunkText } from '../utils/chunker.js';
import { createEmbeddings, createChatCompletion } from '../services/ollama.js';
import { saveDocument, getAllDocuments, getDocument } from '../store/documentStore.js';
import { cosineSimilarity } from '../utils/similarity.js';

const router = express.Router();

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are supported.'));
    }
    cb(null, true);
  }
});

router.get('/documents', (_req, res) => {
  res.json({ documents: getAllDocuments() });
});

router.get('/documents/:id', (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  const { chunks, ...meta } = doc;
  return res.json({ document: meta });
});

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const parsed = await parsePdf(req.file.path);
    const chunkSize = Number(process.env.CHUNK_SIZE || 900);
    const overlap = Number(process.env.CHUNK_OVERLAP || 160);
    const baseChunks = chunkText(parsed.text, chunkSize, overlap);

    if (!baseChunks.length) {
      return res.status(400).json({ error: 'No readable text found in the PDF.' });
    }

    const embeddings = await createEmbeddings(baseChunks.map((chunk) => chunk.content));
    const chunks = baseChunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index] || []
    }));

    const id = crypto.randomUUID();
    const document = saveDocument({
      id,
      name: req.file.originalname,
      pageCount: parsed.pageCount,
      size: req.file.size,
      fileUrl: `/uploads/${path.basename(req.file.path)}`,
      uploadedAt: new Date().toISOString(),
      chunks
    });

    const { chunks: removedChunks, ...summary } = document;
    return res.status(201).json({ document: summary });
  } catch (error) {
    next(error);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { documentId, question, history = [] } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'documentId and question are required.' });
    }

    const doc = getDocument(documentId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const [questionEmbedding] = await createEmbeddings(question);
    const topK = Number(process.env.TOP_K || 5);

    const matches = doc.chunks
      .map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(questionEmbedding, chunk.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    const context = matches
      .map((chunk, index) => `[Snippet ${index + 1}] ${chunk.content}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful Document AI assistant. Answer only using the document context when possible. If the answer is not contained in the context, say that clearly and offer a concise best-effort summary without inventing facts. Keep answers clean and easy to read.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      {
        role: 'user',
        content: `Document name: ${doc.name}\n\nContext:\n${context}\n\nQuestion: ${question}`
      }
    ];

    const answer = await createChatCompletion(messages);

    return res.json({
      answer,
      citations: matches.map((chunk) => ({
        id: chunk.id,
        score: Number(chunk.score.toFixed(4)),
        preview: chunk.content.slice(0, 220)
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
