import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import documentRoutes from './routes/documentRoutes.js';
import { getOllamaConfig } from './services/ollama.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/api', documentRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ollama: getOllamaConfig() });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: error.message || 'Internal server error.'
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
