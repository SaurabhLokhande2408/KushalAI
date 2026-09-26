import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, Menu, Pencil, Plus, Trash2, X } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuidance } from '../context/GuidanceContext';
import GuidanceChat from '../components/guidance/GuidanceChat';
import PracticeQuestion from '../components/guidance/PracticeQuestion';
import UploadDropzone from '../components/roadmap/UploadDropzone';
import { DEFAULT_FILE_NAME, FILE_SUMMARY } from '../utils/guidanceResponses';

const PROCESSING_STEPS = [
  'Uploading material...',
  'Reading document...',
  'Extracting concepts...',
  'Preparing your guidance workspace...'
];

function dateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getConversationGroups(conversations) {
  const today = dateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dateKey(yesterdayDate);
  const groups = { Today: [], Yesterday: [], Older: [] };

  conversations.forEach((conversation) => {
    const key = dateKey(conversation.updatedAt);
    groups[key === today ? 'Today' : key === yesterday ? 'Yesterday' : 'Older'].push(conversation);
  });

  return groups;
}

function formatUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  if (dateKey(date) === dateKey(new Date())) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function DoubtsGuidance() {
  const navigate = useNavigate();
  const {
    conversations,
    selectedConversation,
    createConversation,
    ensureConversation,
    selectConversation,
    attachMaterial,
    sendMessage,
    renameConversation,
    deleteConversation
  } = useGuidance();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const processingIntervalRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const conversationGroups = useMemo(() => getConversationGroups(conversations), [conversations]);

  useEffect(() => {
    if (!selectedConversation) ensureConversation();
  }, [selectedConversation]);

  useEffect(() => () => {
    if (processingIntervalRef.current) window.clearInterval(processingIntervalRef.current);
    if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
  }, []);

  function startNewConversation() {
    createConversation();
    setHistoryOpen(false);
  }

  function handleRename(conversation) {
    const title = window.prompt('Rename conversation', conversation.title);
    if (title?.trim()) renameConversation(conversation.id, title);
  }

  function handleDelete(conversation) {
    if (window.confirm(`Delete “${conversation.title}”? This cannot be undone.`)) {
      deleteConversation(conversation.id);
    }
  }

  function prepareMaterial() {
    if (!uploadFile || uploadProcessing) return;

    const conversation = selectedConversation || ensureConversation();
    const conversationId = conversation.id;
    setUploadProcessing(true);
    setUploadStep(0);
    setUploadProgress(0);

    let phase = 0;
    processingIntervalRef.current = window.setInterval(() => {
      phase += 1;
      setUploadProgress(Math.min(phase * 25, 100));

      if (phase < PROCESSING_STEPS.length) {
        setUploadStep(phase);
      } else {
        window.clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
        navigationTimeoutRef.current = window.setTimeout(() => {
          navigationTimeoutRef.current = null;
          attachMaterial({
            fileName: uploadFile.name,
            fileSize: uploadFile.size,
            fileType: uploadFile.type
          }, conversationId);
          setUploadFile(null);
          setUploadProcessing(false);
          setUploadStep(0);
          setUploadProgress(0);
        }, 160);
      }
    }, 600);
  }

  function selectConversationAndClose(id) {
    selectConversation(id);
    setHistoryOpen(false);
  }

  const material = selectedConversation?.material;

  return (
    <div className="guidance-workspace">
      <header className="guidance-page-header">
        <div>
          <button className="guidance-back-link" type="button" onClick={() => navigate('/learning-workspace')}>
            <ArrowLeft size={15} aria-hidden="true" /> Learning Workspace
          </button>
          <div className="guidance-page-eyebrow">LEARNING WORKSPACE</div>
          <h1>Doubts &amp; Guidance</h1>
          <p>Ask questions, clarify concepts, and practice what you’ve learned.</p>
        </div>
        <button
          className="guidance-mobile-history-toggle"
          type="button"
          aria-expanded={historyOpen}
          aria-controls="guidance-conversation-history"
          onClick={() => setHistoryOpen((open) => !open)}
        >
          {historyOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          <span>Conversations</span>
        </button>
      </header>

      <div className="guidance-workspace-grid">
        <aside
          className={`guidance-history${historyOpen ? ' is-open' : ''}`}
          id="guidance-conversation-history"
          aria-label="Conversation history"
        >
          <div className="guidance-history-heading">
            <div className="guidance-kicker">CONVERSATIONS</div>
            <button className="guidance-new-conversation" type="button" onClick={startNewConversation}>
              <Plus size={16} aria-hidden="true" />
              <span>New conversation</span>
            </button>
          </div>

          <div className="guidance-history-list">
            {['Today', 'Yesterday', 'Older'].map((group) => conversationGroups[group].length > 0 && (
              <section className="guidance-history-group" key={group}>
                <h2>{group}</h2>
                {conversationGroups[group].map((conversation) => (
                  <div
                    className={`guidance-history-item${conversation.id === selectedConversation?.id ? ' is-active' : ''}`}
                    key={conversation.id}
                  >
                    <button
                      className="guidance-history-select"
                      type="button"
                      onClick={() => selectConversationAndClose(conversation.id)}
                      aria-current={conversation.id === selectedConversation?.id ? 'true' : undefined}
                    >
                      <span className="guidance-history-title">{conversation.title}</span>
                      <span className="guidance-history-meta">
                        <span>{conversation.material ? 'MATERIAL' : 'GENERAL'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatUpdatedAt(conversation.updatedAt)}</span>
                      </span>
                    </button>
                    <div className="guidance-history-actions">
                      <button type="button" aria-label={`Rename ${conversation.title}`} title="Rename" onClick={() => handleRename(conversation)}>
                        <Pencil size={14} aria-hidden="true" />
                      </button>
                      <button type="button" aria-label={`Delete ${conversation.title}`} title="Delete" onClick={() => handleDelete(conversation)}>
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            ))}
            {conversations.length === 0 && <p className="guidance-history-empty">Your conversations will appear here.</p>}
          </div>
        </aside>

        <main className="guidance-main-column">
          <div className="guidance-current-heading">
            <div className="guidance-kicker">CURRENT CONVERSATION</div>
            <h2>{selectedConversation?.title || 'New conversation'}</h2>
          </div>
          <GuidanceChat conversation={selectedConversation} onSendMessage={sendMessage} />
        </main>

        <aside className="guidance-context-column" aria-label="Study material and practice">
          <section className="guidance-material-section">
            <div className="guidance-kicker">CURRENT MATERIAL</div>
            {material ? (
              <>
                <div className="guidance-material-file">
                  <FileText size={18} aria-hidden="true" />
                  <span title={material.fileName}>{material.fileName}</span>
                </div>
                <div className="guidance-material-metadata">
                  <span>{material.courseTitle || 'Uploaded material'}</span>
                  {material.fileSize !== null && <span>{(material.fileSize / 1024).toFixed(0)} KB</span>}
                </div>
                <div className="guidance-summary">
                  <div className="guidance-kicker">DOCUMENT SUMMARY</div>
                  {material.fileName === DEFAULT_FILE_NAME ? (
                    <>
                      <h3>Quick summary</h3>
                      <p>{FILE_SUMMARY}</p>
                      <div className="guidance-summary-metadata">
                        <span>AI &amp; Machine Learning</span>
                        <span aria-hidden="true">·</span>
                        <span>Synthetic study notes</span>
                        <span aria-hidden="true">·</span>
                        <span>Uploaded material</span>
                      </div>
                    </>
                  ) : (
                    <p className="guidance-file-limit">This local demo stores the file name and conversation, but does not extract text from uploaded documents.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="guidance-no-material">
                <strong>No study material attached</strong>
                <p>You can ask a general question or add a file to this conversation.</p>
              </div>
            )}
          </section>

          <section className="guidance-upload-section">
            <div className="guidance-kicker">ASK FROM YOUR MATERIAL</div>
            {!uploadProcessing ? (
              <>
                <div className="guidance-upload-dropzone">
                  <UploadDropzone
                    file={uploadFile}
                    onFileSelected={setUploadFile}
                    onClear={() => setUploadFile(null)}
                    title="Add study material"
                    description="Attach a PDF or image to this conversation."
                    chooseLabel="Choose material"
                  />
                </div>
                {uploadFile && (
                  <button className="guidance-prepare-button" type="button" onClick={prepareMaterial}>
                    Prepare guidance workspace
                  </button>
                )}
              </>
            ) : (
              <div className="guidance-processing" role="status" aria-live="polite">
                <div className="guidance-processing-heading">
                  <strong>{PROCESSING_STEPS[Math.min(uploadStep, PROCESSING_STEPS.length - 1)]}</strong>
                  <span>Step {Math.min(uploadStep + 1, PROCESSING_STEPS.length)} of {PROCESSING_STEPS.length}</span>
                </div>
                <div className="guidance-processing-track">
                  <span style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </section>

          <PracticeQuestion />
        </aside>
      </div>

      <style>{`
        .guidance-workspace {
          width: 100%;
          min-width: 0;
          color: #10233f;
        }

        .guidance-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          padding: 8px 0 22px;
          border-bottom: 1px solid #d7dde5;
        }

        .guidance-page-eyebrow {
          margin-bottom: 8px;
          color: #1f559d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .guidance-page-header h1 {
          margin: 0;
          color: #10233f;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 700;
        }

        .guidance-page-header > p {
          margin: 8px 0 0;
          color: #596a7f;
          font-size: 15px;
          line-height: 1.55;
        }

        .guidance-mobile-history-toggle {
          display: none;
          min-height: 40px;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid #c9d2de;
          border-radius: 4px;
          background: #fff;
          color: #1f559d;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .guidance-workspace-grid {
          display: grid;
          grid-template-columns: minmax(205px, .78fr) minmax(0, 2.1fr) minmax(230px, .92fr);
          align-items: start;
          gap: 22px;
          padding-top: 22px;
        }

        .guidance-history {
          min-width: 0;
          min-height: 590px;
          padding: 4px 16px 12px 0;
          border-right: 1px solid #d7dde5;
        }

        .guidance-history-heading {
          display: grid;
          gap: 13px;
          padding-bottom: 15px;
          border-bottom: 1px solid #d7dde5;
        }

        .guidance-kicker {
          color: #1f559d;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .guidance-new-conversation {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 0 10px;
          border: 1px solid #d7dde5;
          border-radius: 4px;
          background: #fff;
          color: #10233f;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .guidance-new-conversation svg {
          color: #ea580c;
        }

        .guidance-new-conversation:hover {
          border-color: #1f559d;
        }

        .guidance-history-list {
          display: grid;
          gap: 20px;
          padding-top: 18px;
        }

        .guidance-history-group h2 {
          margin: 0 0 8px;
          color: #718096;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .guidance-history-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          min-width: 0;
          margin: 0 0 4px;
          border-left: 2px solid transparent;
        }

        .guidance-history-item.is-active {
          border-left-color: #ea580c;
          background: #f2f6fa;
        }

        .guidance-history-select {
          display: grid;
          min-width: 0;
          gap: 5px;
          padding: 9px 6px 9px 9px;
          border: 0;
          background: transparent;
          color: #10233f;
          text-align: left;
          cursor: pointer;
        }

        .guidance-history-title {
          overflow: hidden;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .guidance-history-meta {
          display: flex;
          gap: 5px;
          color: #718096;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
        }

        .guidance-history-actions {
          display: flex;
          padding-right: 4px;
          opacity: 0;
          transition: opacity 140ms ease;
        }

        .guidance-history-item:hover .guidance-history-actions,
        .guidance-history-item:focus-within .guidance-history-actions,
        .guidance-history-item.is-active .guidance-history-actions {
          opacity: 1;
        }

        .guidance-history-actions button {
          display: inline-flex;
          width: 26px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          color: #718096;
          cursor: pointer;
        }

        .guidance-history-actions button:hover {
          color: #ea580c;
        }

        .guidance-history-empty {
          color: #718096;
          font-size: 13px;
          line-height: 1.5;
        }

        .guidance-main-column {
          min-width: 0;
        }

        .guidance-current-heading {
          padding: 4px 0 14px;
          border-bottom: 1px solid #d7dde5;
        }

        .guidance-current-heading h2 {
          overflow-wrap: anywhere;
          margin: 5px 0 0;
          color: #10233f;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 700;
        }

        .guidance-context-column {
          min-width: 0;
          padding-left: 16px;
          border-left: 1px solid #d7dde5;
        }

        .guidance-material-section,
        .guidance-upload-section {
          padding: 4px 0 18px;
          border-bottom: 1px solid #d7dde5;
        }

        .guidance-material-file {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 8px;
          margin-top: 13px;
          color: #1f559d;
          font-size: 13px;
          font-weight: 650;
        }

        .guidance-material-file svg {
          flex: 0 0 auto;
          color: #ea580c;
        }

        .guidance-material-file span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .guidance-material-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 7px 0 15px 26px;
          color: #718096;
          font-size: 11px;
          line-height: 1.4;
        }

        .guidance-summary {
          padding-top: 12px;
          border-top: 1px solid #d7dde5;
        }

        .guidance-summary h3 {
          margin: 6px 0 7px;
          color: #10233f;
          font-size: 17px;
          line-height: 1.25;
          font-weight: 700;
        }

        .guidance-summary > p,
        .guidance-file-limit {
          margin: 0;
          color: #394c63;
          font-size: 13px;
          line-height: 1.55;
        }

        .guidance-summary-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
          color: #66788b;
          font-size: 10px;
          font-weight: 600;
        }

        .guidance-no-material {
          margin-top: 12px;
          padding: 12px 0;
          border-top: 1px solid #d7dde5;
        }

        .guidance-no-material strong {
          color: #10233f;
          font-size: 14px;
        }

        .guidance-no-material p {
          margin-top: 5px;
          color: #596a7f;
          font-size: 12px;
          line-height: 1.5;
        }

        .guidance-upload-section {
          padding-top: 17px;
        }

        .guidance-upload-dropzone {
          margin-top: 11px;
        }

        .guidance-upload-dropzone .upload-dropzone {
          min-height: 152px;
          padding: 17px 12px;
        }

        .guidance-upload-dropzone .upload-dropzone-icon {
          width: 38px;
          height: 38px;
          margin-bottom: 10px;
          border-radius: 8px;
        }

        .guidance-upload-dropzone .upload-dropzone-icon svg {
          width: 22px;
          height: 22px;
        }

        .guidance-upload-dropzone .upload-dropzone-title {
          font-size: 14px;
        }

        .guidance-upload-dropzone .upload-dropzone-description {
          font-size: 11px;
        }

        .guidance-upload-dropzone .upload-dropzone-formats {
          margin-top: 8px;
          font-size: 9px;
        }

        .guidance-upload-dropzone .upload-choose-button {
          margin-top: 12px;
          padding: 8px 10px;
          font-size: 11px;
        }

        .guidance-prepare-button {
          width: 100%;
          min-height: 40px;
          margin-top: 10px;
          padding: 8px 10px;
          border: 0;
          border-radius: 4px;
          background: #1f559d;
          color: #fff;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
        }

        .guidance-prepare-button:hover {
          background: #163f76;
        }

        .guidance-processing {
          margin-top: 12px;
          padding: 12px 0;
        }

        .guidance-processing-heading {
          display: grid;
          gap: 5px;
          margin-bottom: 12px;
        }

        .guidance-processing-heading strong {
          color: #172c47;
          font-size: 13px;
        }

        .guidance-processing-heading span {
          color: #718096;
          font-size: 11px;
        }

        .guidance-processing-track {
          height: 5px;
          overflow: hidden;
          background: #e5ebf2;
        }

        .guidance-processing-track span {
          display: block;
          height: 100%;
          background: #ea580c;
          transition: width 220ms ease;
        }

        .guidance-context-column .guidance-practice {
          padding: 18px 0 0;
          border: 0;
        }

        .guidance-context-column .guidance-practice h2 {
          font-size: 22px;
        }

        .guidance-context-column .guidance-practice-intro {
          font-size: 13px;
        }

        @media (max-width: 1120px) {
          .guidance-workspace-grid {
            grid-template-columns: minmax(190px, .75fr) minmax(0, 1.8fr);
          }

          .guidance-context-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: start;
            gap: 22px;
            grid-column: 2;
            padding: 18px 0 0;
            border-top: 1px solid #d7dde5;
            border-left: 0;
          }

          .guidance-context-column .guidance-practice {
            padding: 0;
          }
        }

        @media (max-width: 760px) {
          .guidance-page-header {
            align-items: flex-start;
            padding-top: 0;
          }

          .guidance-page-header h1 {
            font-size: 32px;
          }

          .guidance-mobile-history-toggle {
            display: inline-flex;
            flex: 0 0 auto;
          }

          .guidance-workspace-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 18px;
          }

          .guidance-history {
            display: none;
            min-height: 0;
            padding: 0 0 16px;
            border-right: 0;
            border-bottom: 1px solid #d7dde5;
          }

          .guidance-history.is-open {
            display: block;
          }

          .guidance-context-column {
            grid-column: 1;
          }

          .guidance-current-heading h2 {
            font-size: 21px;
          }
        }

        @media (max-width: 520px) {
          .guidance-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .guidance-page-header h1 {
            font-size: 28px;
          }

          .guidance-page-header > div > p {
            font-size: 14px;
          }

          .guidance-context-column {
            grid-template-columns: minmax(0, 1fr);
          }

          .guidance-history-actions {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
