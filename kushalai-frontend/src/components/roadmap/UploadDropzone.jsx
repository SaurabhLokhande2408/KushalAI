import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  ArrowUp,
} from 'lucide-react';

export default function UploadDropzone({
  file,
  onFileSelected,
  onClear,
  title = 'Drop your course material here',
  description = 'Build a short assessment from your own notes, course material, or reference documents.',
  chooseLabel = 'Choose file',
  accept = '.pdf,.jpg,.jpeg,.png',
  formats = ['PDF', 'JPG', 'PNG'],
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList) {
    const f = fileList?.[0];

    if (f) {
      onFileSelected(f);
    }
  }

  if (file) {
    return (
      <div className="upload-file-preview">

        <div className="upload-file-icon">
          <FileText size={23} />
        </div>

        <div className="upload-file-info">
          <div className="upload-file-name">
            {file.name}
          </div>

          <div className="upload-file-meta">
            {(file.size / 1024).toFixed(0)} KB
            <span>·</span>
            Ready to process
          </div>
        </div>

        <button
          type="button"
          className="upload-remove"
          onClick={onClear}
          aria-label="Remove file"
        >
          <X size={19} />
        </button>

        <style>{`

          .upload-file-preview {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 17px;
            border: 1px solid rgba(31, 85, 157, 0.18);
            background: #f7f9fc;
          }

          .upload-file-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 46px;
            flex: 0 0 46px;
            border-radius: 11px;
            background: #e8f0fa;
            color: #1f559d;
          }

          .upload-file-info {
            flex: 1;
            min-width: 0;
          }

          .upload-file-name {
            overflow: hidden;
            color: #172c47;
            font-size: 15px;
            font-weight: 750;
            line-height: 1.35;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .upload-file-meta {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-top: 4px;
            color: #7b8999;
            font-size: 12px;
            font-weight: 600;
          }

          .upload-remove {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            flex: 0 0 38px;
            border: 1px solid rgba(18, 63, 115, 0.12);
            border-radius: 50%;
            background: white;
            color: #647387;
            cursor: pointer;
            transition:
              color 160ms ease,
              border-color 160ms ease,
              transform 160ms ease;
          }

          .upload-remove:hover {
            color: #ea580c;
            border-color: rgba(234, 88, 12, 0.28);
            transform: translateY(-1px);
          }

        `}</style>
      </div>
    );
  }

  return (
    <div
      className={`upload-dropzone ${
        dragActive ? 'upload-dropzone-active' : ''
      }`}
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >

      <div className="upload-dropzone-icon">
        <UploadCloud size={31} />
      </div>

      <div className="upload-dropzone-title">
        {title}
      </div>

      <div className="upload-dropzone-description">
        {description}
      </div>

      <div className="upload-dropzone-formats">
        {formats.map((format, index) => (
          <React.Fragment key={format}>
            {index > 0 && <span>·</span>}
            {format}
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        className="upload-choose-button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        {chooseLabel}
        <ArrowUp size={15} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) =>
          handleFiles(e.target.files)
        }
      />

      <style>{`

        .upload-dropzone {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 235px;
          padding: 32px 24px;
          text-align: center;
          border: 1.5px dashed rgba(31, 85, 157, 0.30);
          background:
            linear-gradient(
              180deg,
              rgba(247, 250, 253, 0.96),
              rgba(242, 246, 250, 0.96)
            );
          cursor: pointer;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .upload-dropzone:hover {
          border-color: rgba(31, 85, 157, 0.55);
          background: #f5f8fc;
        }

        .upload-dropzone-active {
          border-color: #ea580c;
          background: #fff8f3;
          transform: scale(1.008);
        }

        .upload-dropzone-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 62px;
          height: 62px;
          margin-bottom: 18px;
          border-radius: 16px;
          background: #e7eff9;
          color: #1f559d;
        }

        .upload-dropzone-title {
          color: #172c47;
          font-size: 19px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .upload-dropzone-description {
          max-width: 390px;
          margin-top: 8px;
          color: #718096;
          font-size: 14px;
          line-height: 1.55;
        }

        .upload-dropzone-formats {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 13px;
          color: #8a96a5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.10em;
        }

        .upload-choose-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 20px;
          padding: 10px 15px;
          border: 1px solid rgba(18, 63, 115, 0.16);
          background: white;
          color: #1f559d;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            transform 160ms ease;
        }

        .upload-choose-button:hover {
          border-color: rgba(31, 85, 157, 0.35);
          transform: translateY(-1px);
        }

      `}</style>
    </div>
  );
}