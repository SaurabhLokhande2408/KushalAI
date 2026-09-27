import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, Menu, Pencil, Plus, Trash2, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/common/UI';
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

function GuidanceLoadingSkeleton() {
  return (
    <div className="guidance-loading-page" aria-busy="true" aria-label="Loading Doubts and Guidance">
      <header className="guidance-loading-header">
        <div><Skeleton width={118} height={14} /><Skeleton width={230} height={32} /></div>
        <Skeleton width={132} height={40} radius={12} />
      </header>
      <div className="guidance-loading-grid">
        <aside className="guidance-loading-history">
          <Skeleton width={120} height={12} />
          <Skeleton width="100%" height={42} radius={8} />
          <Skeleton width={88} height={12} />
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} width="100%" height={52} radius={6} />)}
        </aside>
        <main className="guidance-loading-main">
          <div className="guidance-loading-current"><Skeleton width={140} height={12} /><Skeleton width="min(100%, 360px)" height={28} /></div>
          <div className="guidance-loading-chat-grid">
            <div className="guidance-loading-chat">
              <Skeleton width={130} height={12} />
              <Skeleton width={240} height={30} />
              <Skeleton width="min(100%, 470px)" height={16} />
              <div className="guidance-loading-messages">
                <Skeleton width="72%" height={42} radius={6} />
                <Skeleton width="56%" height={56} radius={6} />
                <Skeleton width="68%" height={42} radius={6} />
              </div>
              <Skeleton width="100%" height={62} radius={6} />
            </div>
            <div className="guidance-loading-card">
              <Skeleton width={165} height={12} />
              <Skeleton width="100%" height={190} radius={6} />
              <Skeleton width="100%" height={42} radius={6} />
            </div>
          </div>
          <div className="guidance-loading-bottom">
            <div className="guidance-loading-card"><Skeleton width={140} height={12} /><Skeleton width="72%" height={22} /><Skeleton width="100%" height={100} radius={6} /></div>
            <div className="guidance-loading-card"><Skeleton width={130} height={12} /><Skeleton width={155} height={25} /><Skeleton width="90%" height={14} /><Skeleton width={160} height={40} radius={6} /></div>
          </div>
        </main>
      </div>
      <style>{`
        .guidance-loading-page {
          min-height: 100vh;
          padding: 22px 0 80px;
          background: #fff;
          color: #10233f;
        }
        .guidance-loading-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 5vw 20px;
          border-bottom: 1px solid #d7dde5;
        }
        .guidance-loading-header > div,
        .guidance-loading-history,
        .guidance-loading-current,
        .guidance-loading-chat,
        .guidance-loading-card {
          display: grid;
          align-content: start;
          gap: 12px;
        }
        .guidance-loading-grid {
          display: grid;
          grid-template-columns: minmax(200px, .8fr) minmax(0, 3fr);
          align-items: start;
          gap: 32px;
          padding: 24px 5vw 0;
        }
        .guidance-loading-history {
          padding-right: 16px;
          border-right: 1px solid #d7dde5;
        }
        .guidance-loading-main { min-width: 0; }
        .guidance-loading-current { gap: 8px; margin-bottom: 22px; }
        .guidance-loading-chat-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(240px, .8fr);
          align-items: stretch;
          gap: 24px;
        }
        .guidance-loading-chat { min-height: 500px; }
        .guidance-loading-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          min-height: 260px;
          margin: 8px 0;
          padding: 12px;
          border-bottom: 1px solid #d7dde5;
        }
        .guidance-loading-messages .skeleton:nth-child(2) { align-self: flex-end; }
        .guidance-loading-card {
          padding: 24px;
          border: 1px solid rgba(215, 221, 229, .6);
          border-radius: 8px;
          background: #fff;
        }
        .guidance-loading-bottom {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #d7dde5;
        }
        @media (max-width: 1100px) {
          .guidance-loading-chat-grid { grid-template-columns: minmax(0, 1.3fr) minmax(220px, .8fr); }
        }
        @media (max-width: 900px) {
          .guidance-loading-grid { grid-template-columns: minmax(180px, .8fr) minmax(0, 2fr); }
          .guidance-loading-chat-grid { grid-template-columns: 1fr; }
          .guidance-loading-bottom { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .guidance-loading-grid { grid-template-columns: 1fr; }
          .guidance-loading-history { display: none; }
        }
      `}</style>
    </div>
  );
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [practiceFile, setPracticeFile] = useState(null);
  const [practiceFileConversationId, setPracticeFileConversationId] = useState(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const processingIntervalRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const conversationGroups = useMemo(() => getConversationGroups(conversations), [conversations]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 800);
    return () => window.clearTimeout(timeoutId);
  }, []);

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

  function handleMaterialFileSelected(file) {
    const conversation = selectedConversation || ensureConversation();
    setUploadFile(file);
    setPracticeFile(file);
    setPracticeFileConversationId(conversation.id);
  }

  function clearMaterialFile() {
    setUploadFile(null);
    setPracticeFile(null);
    setPracticeFileConversationId(null);
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
  const activePracticeFile = practiceFileConversationId === selectedConversation?.id
    ? practiceFile
    : null;

  if (isInitialLoading) return <GuidanceLoadingSkeleton />;

  return (
    <div className="guidance-workspace">
      <header className="guidance-page-header">
        <div className="guidance-header-left">
          <button className="guidance-back-link" type="button" onClick={() => navigate('/learning-workspace')}>
            <span className="back-link-icon"><ArrowLeft size={14} strokeWidth={2.5} aria-hidden="true" /></span> 
            Workspace
          </button>
          <h1>Doubts &amp; Guidance</h1>
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
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
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
          
          <div className="guidance-chat-wrapper">
            <GuidanceChat conversation={selectedConversation} onSendMessage={sendMessage} />

            <section className="guidance-aside-card guidance-upload-section">
              <div className="guidance-kicker">ASK FROM YOUR MATERIAL</div>
              {!uploadProcessing ? (
                <>
                  <div className="guidance-upload-dropzone">
                    <UploadDropzone
                      file={uploadFile || activePracticeFile}
                      onFileSelected={handleMaterialFileSelected}
                      onClear={clearMaterialFile}
                      title="Add study material"
                      description="Attach learning material to this conversation."
                      chooseLabel="Choose material"
                      accept=".pdf,.docx,.pptx,.txt,.jpg,.jpeg,.png"
                      formats={['PDF', 'DOCX', 'PPTX', 'TXT', 'JPG', 'PNG']}
                    />
                  </div>
                  {uploadFile && (
                    <button className="guidance-prepare-button" type="button" onClick={prepareMaterial}>
                      Prepare guidance workspace
                    </button>
                  )}
                  {!uploadFile && activePracticeFile && (
                    <p className="guidance-upload-ready">Material is ready for your knowledge check.</p>
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
          </div>

          <div className="guidance-context-bottom" aria-label="Study material and practice">
            <section className="guidance-aside-card guidance-material-section">
              <div className="guidance-kicker">CURRENT MATERIAL</div>
              {material ? (
                <>
                  <div className="guidance-material-file">
                    <FileText size={20} strokeWidth={2} aria-hidden="true" />
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
                          <span className="guidance-pill">AI &amp; Machine Learning</span>
                          <span className="guidance-pill">Study Notes</span>
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

            <div className="guidance-aside-card">
              <PracticeQuestion
                selectedFile={activePracticeFile}
                conversationId={selectedConversation?.id}
              />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        /* =====================================================
           BASE & VARIABLES
        ===================================================== */
        .guidance-workspace {
          --gd-blue: #1f559d;
          --gd-blue-hover: #163f76;
          --gd-orange: #ea580c;
          --gd-ink: #10233f;
          --gd-ink-dark: #172c47;
          --gd-muted: #718096;
          --gd-muted-light: #596a7f;
          --gd-line: #d7dde5;
          --gd-bg-subtle: #f2f6fa;
          --gd-white: #ffffff;
          
          /* RGB variables for Apple-style shadows */
          --gd-ink-rgb: 16, 35, 63;
          --gd-blue-rgb: 31, 85, 157;

          width: 100%;
          min-height: 100vh; /* Natural scrolling height */
          display: flex;
          flex-direction: column;
          background: var(--gd-white);

          color: var(--gd-ink);
          font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* =====================================================
           HEADER
        ===================================================== */
        .guidance-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
          padding: 16px 5vw;
          border-bottom: 1px solid rgba(215, 221, 229, 0.6);
        }

        .guidance-header-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .guidance-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px 4px 4px;
          border: 0;
          border-radius: 99px;
          background: transparent;
          color: var(--gd-muted);
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .back-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--gd-white);
          box-shadow: 0 2px 8px rgba(var(--gd-ink-rgb), 0.06);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .guidance-back-link:hover {
          color: var(--gd-blue);
          background: rgba(215, 221, 229, 0.2);
        }

        .guidance-back-link:hover .back-link-icon {
          transform: translateX(-3px);
          color: var(--gd-blue);
        }

        .guidance-page-header h1 {
          margin: 0;
          color: var(--gd-ink);
          font-size: clamp(28px, 3.5vw, 36px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        .guidance-mobile-history-toggle {
          display: none;
          min-height: 40px;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          border: 1px solid rgba(201, 210, 222, 0.5);
          border-radius: 12px;
          background: var(--gd-white);
          color: var(--gd-blue);
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(var(--gd-ink-rgb), 0.04);
          transition: all 0.3s ease;
        }

        .guidance-mobile-history-toggle:active {
          transform: scale(0.97);
        }

        /* =====================================================
           LAYOUT GRID (NATURAL SCROLL)
        ===================================================== */
        .guidance-workspace-grid {
          display: grid;
          grid-template-columns: minmax(240px, 0.8fr) minmax(0, 3fr);
          align-items: start;
          gap: 32px;
          padding: 24px 5vw 80px 5vw; /* Added bottom padding for breathing room */
        }

        /* =====================================================
           SIDEBAR (HISTORY)
        ===================================================== */
        .guidance-history {
          min-width: 0;
          padding-right: 12px;
          border-right: 1px solid rgba(215, 221, 229, 0.6);
        }

        .guidance-history-heading {
          display: grid;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(215, 221, 229, 0.6);
        }

        .guidance-kicker {
          color: var(--gd-blue);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .guidance-new-conversation {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 16px;
          border: 1px solid rgba(215, 221, 229, 0.8);
          border-radius: 12px;
          background: var(--gd-white);
          color: var(--gd-ink);
          font: inherit;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(var(--gd-ink-rgb), 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .guidance-new-conversation svg {
          color: var(--gd-orange);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .guidance-new-conversation:hover {
          border-color: transparent;
          box-shadow: 0 6px 16px rgba(var(--gd-ink-rgb), 0.06);
          transform: translateY(-1px);
        }

        .guidance-new-conversation:hover svg {
          transform: rotate(90deg);
        }

        .guidance-history-list {
          display: grid;
          gap: 24px;
          padding-top: 24px;
        }

        .guidance-history-group h2 {
          margin: 0 0 10px 10px;
          color: var(--gd-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .guidance-history-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          min-width: 0;
          margin: 0 0 4px;
          border-radius: 10px;
          padding: 4px;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .guidance-history-item:hover {
          background: rgba(242, 246, 250, 0.5);
        }

        .guidance-history-item.is-active {
          background: var(--gd-bg-subtle);
          box-shadow: inset 0 0 0 1px rgba(215, 221, 229, 0.4);
        }

        .guidance-history-select {
          display: grid;
          min-width: 0;
          gap: 6px;
          padding: 8px;
          border: 0;
          background: transparent;
          color: var(--gd-ink);
          text-align: left;
          cursor: pointer;
        }

        .guidance-history-title {
          overflow: hidden;
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .guidance-history-item.is-active .guidance-history-title {
          color: var(--gd-blue);
        }

        .guidance-history-meta {
          display: flex;
          gap: 6px;
          color: var(--gd-muted);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .guidance-history-actions {
          display: flex;
          padding-right: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .guidance-history-item:hover .guidance-history-actions,
        .guidance-history-item:focus-within .guidance-history-actions,
        .guidance-history-item.is-active .guidance-history-actions {
          opacity: 1;
        }

        .guidance-history-actions button {
          display: inline-flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: var(--gd-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .guidance-history-actions button:hover {
          background: var(--gd-white);
          color: var(--gd-orange);
          box-shadow: 0 2px 6px rgba(var(--gd-ink-rgb), 0.05);
        }

        .guidance-history-empty {
          color: var(--gd-muted);
          font-size: 13px;
          line-height: 1.5;
          padding: 0 10px;
        }

        /* =====================================================
           MAIN COLUMN (CHAT & BOTTOM CARDS)
        ===================================================== */
        .guidance-main-column {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .guidance-current-heading {
          flex-shrink: 0;
          padding: 0 0 20px;
          border-bottom: 1px solid rgba(215, 221, 229, 0.6);
          margin-bottom: 24px;
        }

        .guidance-current-heading h2 {
          overflow-wrap: anywhere;
          margin: 8px 0 0;
          color: var(--gd-ink);
          font-size: 28px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .guidance-chat-wrapper {
          min-height: 400px;
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(270px, 0.8fr);
          align-items: stretch;
          gap: 24px;
          margin-bottom: 24px;
        }

        .guidance-upload-section {
          align-self: stretch;
        }

        .guidance-upload-ready {
          margin: 12px 0 0;
          color: var(--gd-muted-light);
          font-size: 13px;
        }

        /* =====================================================
           BOTTOM HORIZONTAL CONTEXT (WIDGETS)
        ===================================================== */
        .guidance-context-bottom {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          padding-top: 32px;
          border-top: 1px solid rgba(215, 221, 229, 0.6);
        }

        .guidance-aside-card {
          background: var(--gd-white);
          border: 1px solid rgba(215, 221, 229, 0.5);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(var(--gd-ink-rgb), 0.02);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .guidance-aside-card:hover {
          box-shadow: 0 8px 24px rgba(var(--gd-ink-rgb), 0.05);
          transform: translateY(-2px);
        }

        .guidance-material-file {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          color: var(--gd-blue);
          font-size: 14px;
          font-weight: 700;
        }

        .guidance-material-file svg {
          flex: 0 0 auto;
          color: var(--gd-orange);
          background: rgba(234, 88, 12, 0.1);
          padding: 6px;
          border-radius: 8px;
          width: 32px;
          height: 32px;
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
          margin: 8px 0 20px 44px;
          color: var(--gd-muted);
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
        }

        .guidance-summary {
          padding-top: 16px;
          border-top: 1px solid rgba(215, 221, 229, 0.6);
        }

        .guidance-summary h3 {
          margin: 12px 0 8px;
          color: var(--gd-ink);
          font-size: 16px;
          line-height: 1.3;
          font-weight: 700;
        }

        .guidance-summary > p,
        .guidance-file-limit {
          margin: 0;
          color: var(--gd-muted-light);
          font-size: 13px;
          line-height: 1.6;
        }

        .guidance-summary-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .guidance-pill {
          background: var(--gd-bg-subtle);
          color: var(--gd-muted-light);
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .guidance-no-material {
          margin-top: 16px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(215, 221, 229, 0.2);
        }

        .guidance-no-material strong {
          color: var(--gd-ink);
          font-size: 14px;
          font-weight: 700;
        }

        .guidance-no-material p {
          margin-top: 6px;
          color: var(--gd-muted-light);
          font-size: 13px;
          line-height: 1.5;
        }

        .guidance-upload-dropzone {
          margin-top: 16px;
        }

        .guidance-upload-dropzone .upload-dropzone {
          min-height: 160px;
          padding: 24px 16px;
          border: 1px dashed rgba(201, 210, 222, 0.8);
          border-radius: 16px;
          background: rgba(242, 246, 250, 0.3);
          transition: all 0.3s ease;
        }

        .guidance-upload-dropzone .upload-dropzone:hover {
          border-color: var(--gd-blue);
          background: rgba(242, 246, 250, 0.8);
        }

        .guidance-prepare-button {
          width: 100%;
          min-height: 44px;
          margin-top: 16px;
          padding: 8px 16px;
          border: 0;
          border-radius: 12px;
          background: var(--gd-blue);
          color: var(--gd-white);
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(var(--gd-blue-rgb), 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .guidance-prepare-button:hover {
          background: var(--gd-blue-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(var(--gd-blue-rgb), 0.3);
        }

        .guidance-prepare-button:active {
          transform: scale(0.98);
        }

        .guidance-processing {
          margin-top: 16px;
          padding: 16px;
          background: var(--gd-bg-subtle);
          border-radius: 12px;
        }

        .guidance-processing-heading {
          display: grid;
          gap: 6px;
          margin-bottom: 14px;
        }

        .guidance-processing-heading strong {
          color: var(--gd-ink-dark);
          font-size: 13px;
        }

        .guidance-processing-heading span {
          color: var(--gd-muted);
          font-size: 11px;
          font-weight: 600;
        }

        .guidance-processing-track {
          height: 6px;
          overflow: hidden;
          background: rgba(215, 221, 229, 0.6);
          border-radius: 99px;
        }

        .guidance-processing-track span {
          display: block;
          height: 100%;
          background: var(--gd-orange);
          border-radius: 99px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .guidance-context-bottom .guidance-practice {
          padding: 0;
          border: 0;
        }

        .guidance-context-bottom .guidance-practice h2 {
          font-size: 20px;
          font-weight: 800;
        }

        .guidance-context-bottom .guidance-practice-intro {
          font-size: 14px;
          color: var(--gd-muted-light);
        }

        /* =====================================================
           RESPONSIVE REFINEMENTS
        ===================================================== */
        @media (max-width: 1200px) {
          .guidance-context-bottom {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .guidance-chat-wrapper {
            grid-template-columns: 1fr;
          }

          .guidance-workspace-grid {
            grid-template-columns: minmax(220px, 0.8fr) minmax(0, 2fr);
          }

          .guidance-context-bottom {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .guidance-page-header {
            align-items: flex-start;
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
            gap: 24px;
          }

          .guidance-history {
            display: none;
            min-height: 0;
            padding: 0 0 20px;
            border-right: 0;
            border-bottom: 1px solid rgba(215, 221, 229, 0.6);
          }

          .guidance-history.is-open {
            display: block;
          }

          .guidance-current-heading h2 {
            font-size: 24px;
          }
        }

        @media (max-width: 520px) {
          .guidance-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .guidance-page-header h1 {
            font-size: 28px;
          }

          .guidance-history-actions {
            opacity: 1;
          }
          
          .guidance-aside-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}