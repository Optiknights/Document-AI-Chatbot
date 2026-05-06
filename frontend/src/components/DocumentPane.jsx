import { FileText, UploadCloud } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export default function DocumentPane({ document, onUpload, isUploading }) {
  const previewUrl = document ? `${API_BASE_URL}${document.fileUrl}` : null;

  return (
    <section className="panel doc-panel">
      <div className="panel-toolbar">
        <span className="toolbar-dot" />
        <span className="toolbar-line long" />
        <span className="toolbar-line" />
      </div>

      {!document ? (
        <label className="upload-state">
          <input type="file" accept="application/pdf" hidden onChange={onUpload} />
          <div className="upload-card">
            <UploadCloud size={34} />
            <h3>Upload your PDF</h3>
            <p>Index a document locally, then chat with it using Ollama.</p>
            <span className="upload-button">{isUploading ? 'Uploading…' : 'Choose PDF'}</span>
          </div>
        </label>
      ) : (
        <>
          <div className="doc-header">
            <div className="doc-meta">
              <FileText size={18} />
              <div>
                <strong>{document.name}</strong>
                <p>{document.pageCount} pages</p>
              </div>
            </div>
            <label className="secondary-upload">
              Replace PDF
              <input type="file" accept="application/pdf" hidden onChange={onUpload} />
            </label>
          </div>

          <div className="pdf-frame-wrap">
            <iframe className="pdf-frame" title="PDF preview" src={previewUrl} />
          </div>
        </>
      )}
    </section>
  );
}
