import { useRef } from 'react';
import { Shield, SendHorizonal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useAutoScroll } from '../hooks/useAutoScroll';

export default function ChatPane({ messages, question, setQuestion, onSubmit, isLoading, citations, hasDocument }) {
  const messagesRef = useRef(null);
  useAutoScroll(messagesRef, messages);

  return (
    <section className="panel chat-panel">
      <div className="chat-header">
        <div className="chat-badge">
          <Shield size={15} />
          <span>Document AI Chat</span>
        </div>
      </div>

      <div className="messages" ref={messagesRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}

        {!hasDocument && (
          <div className="empty-tip">
            Upload a PDF on the left, then ask questions here.
          </div>
        )}
      </div>

      {citations.length > 0 && (
        <div className="citation-box">
          <p>Top retrieved snippets</p>
          {citations.slice(0, 3).map((citation) => (
            <div key={citation.id} className="citation-item">
              <span>Similarity {citation.score}</span>
              <small>{citation.preview}...</small>
            </div>
          ))}
        </div>
      )}

      <form className="chat-input-row" onSubmit={onSubmit}>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={hasDocument ? 'Ask a question about the PDF...' : 'Upload a PDF first'}
          disabled={!hasDocument || isLoading}
        />
        <button type="submit" disabled={!hasDocument || isLoading || !question.trim()}>
          {isLoading ? '...' : <SendHorizonal size={16} />}
        </button>
      </form>
    </section>
  );
}
