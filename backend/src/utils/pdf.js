import fs from 'fs/promises';
import pdf from 'pdf-parse';

export async function parsePdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);
  return {
    text: data.text || '',
    pageCount: data.numpages || 0,
    info: data.info || {}
  };
}
