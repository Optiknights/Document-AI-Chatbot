export function chunkText(text, chunkSize = 900, overlap = 160) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    const content = cleaned.slice(start, end).trim();

    if (content) {
      chunks.push({
        id: crypto.randomUUID(),
        content,
        start,
        end
      });
    }

    if (end >= cleaned.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
