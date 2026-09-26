import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function UploadDropzone({ file, onFileSelected, onClear }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList) {
    const f = fileList?.[0];
    if (f) onFileSelected(f);
  }

  if (file) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
        <FileText size={22} color="var(--color-primary)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</div>
          <div className="text-meta">{(file.size / 1024).toFixed(0)} KB · ready to process</div>
        </div>
        <button onClick={onClear} aria-label="Remove file" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`dropzone ${dragActive ? 'drag-active' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
    >
      <UploadCloud size={28} style={{ margin: '0 auto 10px', color: 'var(--color-secondary)' }} />
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Drop course material here</div>
      <div className="text-meta">PDF, JPG or PNG</div>
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={(e) => e.stopPropagation() || inputRef.current?.click()}>
        Choose file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
