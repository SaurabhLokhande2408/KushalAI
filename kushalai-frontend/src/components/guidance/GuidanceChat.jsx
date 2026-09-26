import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

export default function GuidanceChat({ conversation, onSendMessage }) {
  const [draft, setDraft] = useState('');
  const conversationEndRef = useRef(null);
  const inputRef = useRef(null);
  const messages = conversation?.messages || [];

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, conversation?.id]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [conversation?.id]);

  function sendMessage(event) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    onSendMessage(question);
    setDraft('');
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  }

  return (
    <section className="guidance-chat">
      <header className="guidance-section-header">
        <div>
          <div className="guidance-kicker">DISCUSSION</div>
          <h2>Ask a question</h2>
          <p>{conversation?.material ? 'Continue exploring this material or ask a related question.' : 'Ask about a concept, even when no study material is attached.'}</p>
        </div>
      </header>

      <div className="guidance-conversation" role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((message) => (
          <article className={`guidance-message guidance-message-${message.role}`} key={message.id}>
            <div className="guidance-message-author">{message.role === 'assistant' ? 'KushalAI guidance' : 'You'}</div>
            <p>{message.content}</p>
          </article>
        ))}
        {messages.length === 0 && (
          <div className="guidance-empty-chat">
            <strong>Begin with a question</strong>
            <p>Explore a concept from your material or start with one of these topics.</p>
            <div className="guidance-suggestions">
              {['What is overfitting?', 'How does supervised learning work?', 'What is a train/test split?'].map((question) => (
                <button type="button" key={question} onClick={() => onSendMessage(question)}>{question}</button>
              ))}
            </div>
          </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <form className="guidance-composer" onSubmit={sendMessage}>
        <label className="guidance-visually-hidden" htmlFor="guidance-question">Ask a doubt about your material</label>
        <textarea
          ref={inputRef}
          id="guidance-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask a question..."
          rows={2}
        />
        <button className="guidance-send-button" type="submit" disabled={!draft.trim()}>
          <span>Send</span>
          <Send size={16} aria-hidden="true" />
        </button>
      </form>

      <style>{`
        .guidance-chat {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 500px;
        }

        .guidance-section-header h2 {
          margin: 4px 0 5px;
          color: #10233f;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
        }

        .guidance-section-header p {
          margin: 0;
          color: #596a7f;
          font-size: 16px;
          line-height: 1.5;
        }

        .guidance-kicker {
          color: #1f559d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .guidance-conversation {
          flex: 1;
          min-height: 300px;
          max-height: 560px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          margin: 18px 0 16px;
          padding: 6px 4px 8px 0;
          border-bottom: 1px solid #d7dde5;
          scrollbar-width: thin;
        }

        .guidance-message {
          max-width: min(100%, 760px);
          padding: 2px 0 2px 14px;
          border-left: 3px solid #1f559d;
        }

        .guidance-message-user {
          align-self: flex-end;
          max-width: min(82%, 620px);
          padding: 12px 15px;
          border: 1px solid #d7e2ef;
          border-left: 3px solid #ea580c;
          background: #f2f6fa;
        }

        .guidance-message-author {
          margin-bottom: 5px;
          color: #596a7f;
          font-size: 12px;
          font-weight: 700;
        }

        .guidance-message p {
          margin: 0;
          color: #25364b;
          font-size: 15px;
          line-height: 1.65;
          white-space: pre-wrap;
        }

        .guidance-empty-chat {
          margin: auto 0;
          padding: 24px 0;
          color: #596a7f;
        }

        .guidance-empty-chat strong {
          display: block;
          margin-bottom: 6px;
          color: #10233f;
          font-size: 18px;
        }

        .guidance-empty-chat p {
          font-size: 14px;
          line-height: 1.5;
        }

        .guidance-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .guidance-suggestions button {
          padding: 8px 10px;
          border: 1px solid #d7dde5;
          border-radius: 4px;
          background: #fff;
          color: #1f559d;
          font: inherit;
          font-size: 12px;
          text-align: left;
          cursor: pointer;
        }

        .guidance-suggestions button:hover {
          border-color: #1f559d;
        }

        .guidance-composer {
          display: flex;
          align-items: stretch;
          gap: 10px;
        }

        .guidance-composer textarea {
          flex: 1;
          min-width: 0;
          min-height: 56px;
          resize: vertical;
          padding: 14px 15px;
          border: 1px solid #c9d2de;
          border-radius: 6px;
          background: #fff;
          color: #10233f;
          font: inherit;
          font-size: 15px;
          line-height: 1.45;
        }

        .guidance-composer textarea:focus-visible {
          outline: 2px solid #1f559d;
          outline-offset: 2px;
        }

        .guidance-send-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 102px;
          padding: 0 16px;
          border: 0;
          border-radius: 6px;
          background: #1f559d;
          color: #fff;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .guidance-send-button:disabled {
          opacity: .48;
          cursor: not-allowed;
        }

        .guidance-send-button:focus-visible {
          outline: 2px solid #ea580c;
          outline-offset: 2px;
        }

        .guidance-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          clip-path: inset(50%);
        }

        @media (max-width: 600px) {
          .guidance-chat {
            min-height: 430px;
          }

          .guidance-section-header h2 {
            font-size: 24px;
          }

          .guidance-composer {
            flex-direction: column;
          }

          .guidance-send-button {
            min-height: 46px;
          }
        }
      `}</style>
    </section>
  );
}
