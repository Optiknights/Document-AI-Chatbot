import { ShieldCheck, Sparkles, MoreHorizontal } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="topbar">
      <div>
        <p className="eyebrow">Ollama powered RAG assistant</p>
        <h1>Document AI Chat</h1>
        <p className="subtext">Ask questions over PDFs and get fast, grounded answers with a UI styled to match your reference.</p>
      </div>

      <div className="topbar-actions">
        <div className="pill"><ShieldCheck size={16} /> Local first</div>
        <div className="pill"><Sparkles size={16} /> Clean UI</div>
        <button className="icon-button" type="button" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
