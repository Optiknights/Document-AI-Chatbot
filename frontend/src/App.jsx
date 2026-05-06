import { useMemo, useState } from 'react';
import TopBar from './components/TopBar';
import DocumentPane from './components/DocumentPane';
import ChatPane from './components/ChatPane';
import { askDocumentQuestion, uploadDocument } from './utils/api';

const starterMessages = [
  {
    id: 'm1',
    role: 'user',
    content: 'What are the refund policy terms?'
  },
  {
    id: 'm2',
    role: 'assistant',
    content: 'Upload a PDF and I will answer using the document context.'
  }
];

export default function App() {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState(starterMessages);
  const [question, setQuestion] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [citations, setCitations] = useState([]);

  const history = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { document: uploadedDocument } = await uploadDocument(file);
      setDocument(uploadedDocument);
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: `Loaded ${uploadedDocument.name}`
        },
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Your PDF is indexed. Ask anything about the document.'
        }
      ]);
      setCitations([]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: error.message
        }
      ]);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim() || !document || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim()
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const { answer, citations: resultCitations } = await askDocumentQuestion({
        documentId: document.id,
        question: userMessage.content,
        history
      });

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: answer
        }
      ]);
      setCitations(resultCitations || []);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: error.message
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="app-card">
        <TopBar />
        <div className="workspace-grid">
          <DocumentPane document={document} onUpload={handleUpload} isUploading={isUploading} />
          <ChatPane
            messages={messages}
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            citations={citations}
            hasDocument={Boolean(document)}
          />
        </div>
      </div>
    </main>
  );
}
