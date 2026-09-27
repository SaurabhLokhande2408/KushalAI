import React, { useEffect, useRef, useState } from 'react';
import { Check, FileText, RotateCcw } from 'lucide-react';
import { Button } from '../common/UI';

const SUPPORTED_EXTENSIONS = new Set(['pdf', 'docx', 'pptx', 'txt']);
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function getExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

async function extractText(file) {
  const extension = getExtension(file.name);

  if (extension === 'txt') return file.text();

  if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      let pageText = '';
      content.items.forEach((item) => {
        pageText += item.str || '';
        pageText += item.hasEOL ? '\n' : ' ';
      });
      pages.push(pageText);
    }

    await document.destroy();
    return pages.join('\n');
  }

  if (extension === 'docx') {
    const mammoth = (await import('mammoth/mammoth.browser')).default;
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }

  if (extension === 'pptx') {
    const JSZip = (await import('jszip')).default;
    const archive = await JSZip.loadAsync(file);
    const slidePaths = Object.keys(archive.files)
      .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
      .sort((left, right) => Number(left.match(/slide(\d+)/)[1]) - Number(right.match(/slide(\d+)/)[1]));
    const slides = await Promise.all(slidePaths.map(async (path) => {
      const xml = await archive.file(path).async('text');
      const parsed = new DOMParser().parseFromString(xml, 'application/xml');
      const namespace = 'http://schemas.openxmlformats.org/drawingml/2006/main';
      return Array.from(parsed.getElementsByTagNameNS(namespace, 'p')).map((paragraph) => (
        Array.from(paragraph.getElementsByTagNameNS(namespace, 't'))
          .map((node) => node.textContent)
          .join('')
      )).join('\n');
    }));
    return slides.join('\n');
  }

  throw new Error('unsupported');
}

function getFacts(text) {
  const normalized = text
    .replace(/[\u2022\u25aa\u25cf]/g, '\n')
    .replace(/([.!?])\s+/g, '$1\n')
    .replace(/[\t ]+/g, ' ');
  const seen = new Set();

  return normalized.split(/\n+/)
    .map((fact) => fact.trim().replace(/^[-*\d.)\s]+/, ''))
    .filter((fact) => fact.split(/\s+/).length >= 6)
    .filter((fact) => {
      const key = fact.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key.length < 25 || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getTopic(fact, index) {
  const definition = fact.match(/^(.{2,90}?)\s+(?:is|are|was|were|means|refers to|describes|uses|includes|contains|requires|helps|allows|predicts|learns)\b/i);
  if (definition) return definition[1].replace(/^[,\s]+|[,\s]+$/g, '');
  return fact.split(/\s+/).slice(0, 5).join(' ') || `concept ${index + 1}`;
}

function generateQuestions(text) {
  const facts = getFacts(text);
  if (facts.length < 5) throw new Error('insufficient');

  const questions = facts.slice(0, 5).map((fact, index) => {
    const options = [fact];
    for (let offset = 1; options.length < 4; offset += 1) {
      const distractor = facts[(index + offset) % facts.length];
      if (!options.includes(distractor)) options.push(distractor);
    }
    const topic = getTopic(fact, index);

    return {
      question: `Which statement about ${topic} matches the uploaded material?`,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: fact,
      explanation: `This statement is taken from the uploaded material: ${fact}`
    };
  });

  return questions;
}

function formatFileSize(size) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`;
}

export default function PracticeQuestion({ selectedFile, conversationId }) {
  const loadRequestRef = useRef(0);
  const syncedFileRef = useRef(null);
  const syncedConversationRef = useRef(null);
  const [file, setFile] = useState(null);
  const [materialText, setMaterialText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [state, setState] = useState('empty');
  const [errorMessage, setErrorMessage] = useState('');

  async function selectFile(selectedFile) {
    if (!selectedFile) return;
    const requestId = ++loadRequestRef.current;
    syncedFileRef.current = selectedFile;
    syncedConversationRef.current = conversationId;
    const extension = getExtension(selectedFile.name);
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      syncedFileRef.current = null;
      setFile(null);
      setMaterialText('');
      setErrorMessage('Please upload a supported learning file.');
      setState('error');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      syncedFileRef.current = null;
      setFile(null);
      setMaterialText('');
      setErrorMessage('This file is too large. Please choose a file under 20 MB.');
      setState('error');
      return;
    }

    setState('reading');
    setErrorMessage('');
    setQuestions([]);
    setAnswers([]);
    setFile(selectedFile);
    try {
      const text = (await extractText(selectedFile)).replace(/[\t ]+/g, ' ').trim();
      if (requestId !== loadRequestRef.current) return;
      if (getFacts(text).length < 5) {
        throw new Error('insufficient');
      }
      setFile(selectedFile);
      setMaterialText(text);
      setState('ready');
    } catch (error) {
      if (requestId !== loadRequestRef.current) return;
      setFile(null);
      setMaterialText('');
      setErrorMessage(error.message === 'unsupported'
        ? 'Please upload a supported learning file.'
        : "We couldn't extract enough content from this file to generate questions.");
      setState('error');
    }
  }

  useEffect(() => {
    if (selectedFile === syncedFileRef.current && conversationId === syncedConversationRef.current) return;
    syncedFileRef.current = selectedFile || null;
    syncedConversationRef.current = conversationId;
    loadRequestRef.current += 1;
    if (selectedFile) {
      selectFile(selectedFile);
      return;
    }
    setFile(null);
    setMaterialText('');
    setQuestions([]);
    setAnswers([]);
    setErrorMessage('');
    setState('empty');
  }, [selectedFile, conversationId]);

  async function generatePractice() {
    if (!file || !materialText || state === 'generating') return;
    setState('generating');
    setErrorMessage('');
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    try {
      const generated = generateQuestions(materialText);
      setQuestions(generated);
      setAnswers(Array(generated.length).fill(null));
      setQuestionIndex(0);
      setState('quiz');
    } catch {
      setErrorMessage('Unable to generate your knowledge check. Please make sure the uploaded file contains readable learning material and try again.');
      setState('error');
    }
  }

  function chooseAnswer(answer) {
    setAnswers((current) => current.map((value, index) => index === questionIndex ? answer : value));
  }

  function submitQuiz() {
    setState('result');
  }

  function tryAgain() {
    setAnswers(Array(questions.length).fill(null));
    setQuestionIndex(0);
    setState('quiz');
  }

  function backToGuidance() {
    setQuestionIndex(0);
    setAnswers([]);
    setState(file ? 'ready' : 'empty');
  }

  const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  const question = questions[questionIndex];

  return (
    <aside className="guidance-practice">
      <div className="guidance-kicker">KNOWLEDGE CHECK</div>
      <h2>Practice</h2>
      <p className="guidance-practice-intro">Generate a personalized 5-question knowledge check from your learning material.</p>

      <div className="guidance-practice-flow">
        {state === 'empty' && (
          <p className="guidance-practice-empty">Upload learning material in the card beside Discussion to begin.</p>
        )}

        {state === 'reading' && (
          <p className="guidance-practice-empty" role="status">Reading uploaded material...</p>
        )}

        {state === 'error' && !file && (
          <div className="guidance-practice-error" role="alert">
            <p>{errorMessage}</p>
            <span>Choose a readable learning file in the material card beside Discussion.</span>
          </div>
        )}

        {(state === 'ready' || (state === 'error' && file)) && (
          <div className="guidance-practice-ready">
            <div className="guidance-practice-file">
              <Check size={17} aria-hidden="true" />
              <FileText size={18} aria-hidden="true" />
              <span title={file.name}>{file.name}</span>
            </div>
            <span className="guidance-practice-file-size">{formatFileSize(file.size)}</span>
            <div className="guidance-practice-actions">
              <Button type="button" onClick={generatePractice}>Generate 5 MCQs</Button>
            </div>
            {state === 'error' && (
              <div className="guidance-practice-error" role="alert">
                <p>{errorMessage}</p>
                <Button type="button" onClick={generatePractice}>Try again</Button>
              </div>
            )}
          </div>
        )}

        {state === 'generating' && (
          <div className="guidance-practice-generating" role="status" aria-live="polite">
            <strong>GENERATING KNOWLEDGE CHECK</strong>
            <span>Analyzing learning material...</span>
            <span>Creating questions...</span>
            <span>Building answer options...</span>
            <div className="guidance-practice-progress"><span /></div>
          </div>
        )}

        {state === 'quiz' && question && (
          <div className="guidance-mcq">
            <div className="guidance-mcq-progress">
              <span>QUESTION {questionIndex + 1} OF 5</span>
              <span>{questionIndex + 1} / 5</span>
            </div>
            <div className="guidance-mcq-progress-track" aria-hidden="true">
              <span style={{ width: `${((questionIndex + 1) / 5) * 100}%` }} />
            </div>
            <h3>{question.question}</h3>
            <div className="guidance-mcq-options" role="group" aria-label="Answer choices">
              {question.options.map((option, index) => {
                const selected = answers[questionIndex] === option;
                return (
                  <button
                    className={`guidance-mcq-option${selected ? ' is-selected' : ''}`}
                    type="button"
                    key={`${questionIndex}-${option}`}
                    aria-pressed={selected}
                    onClick={() => chooseAnswer(option)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            <div className="guidance-practice-actions">
              <Button
                type="button"
                disabled={answers[questionIndex] === null}
                onClick={() => questionIndex === 4 ? submitQuiz() : setQuestionIndex((index) => index + 1)}
              >
                {questionIndex === 4 ? 'Submit' : 'Next question'}
              </Button>
            </div>
          </div>
        )}

        {state === 'result' && (
          <div className="guidance-practice-result" aria-live="polite">
            <strong>KNOWLEDGE CHECK COMPLETE</strong>
            <div className="guidance-practice-score">{score} / 5</div>
            <div className="guidance-practice-percent">{Math.round((score / 5) * 100)}%</div>
            <p>{score >= 4
              ? 'Strong understanding of the uploaded material.'
              : 'Review the concepts you missed before continuing.'}</p>
            <div className="guidance-practice-actions">
              <Button type="button" variant="secondary" onClick={() => setState('review')}>Review Answers</Button>
              <Button type="button" onClick={tryAgain}><RotateCcw size={15} aria-hidden="true" /> Try Again</Button>
              <Button type="button" variant="secondary" onClick={backToGuidance}>Back to Guidance</Button>
            </div>
          </div>
        )}

        {state === 'review' && (
          <div className="guidance-practice-review">
            <strong>ANSWER REVIEW</strong>
            {questions.map((item, index) => (
              <section key={`review-${index}`}>
                <h3>{index + 1}. {item.question}</h3>
                <p className={answers[index] === item.correctAnswer ? 'is-correct' : 'is-incorrect'}>
                  Your answer: {answers[index] || 'No answer'}
                </p>
                <p className="is-correct">Correct answer: {item.correctAnswer}</p>
              </section>
            ))}
            <Button type="button" variant="secondary" onClick={backToGuidance}>Back to Guidance</Button>
          </div>
        )}

      </div>

      <style>{`
        .guidance-practice {
          min-width: 0;
          padding: 28px 0 0 26px;
          border-left: 1px solid #d7dde5;
        }

        .guidance-practice h2 {
          margin: 4px 0 5px;
          color: #10233f;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
        }

        .guidance-practice-intro {
          margin: 0 0 22px;
          color: #596a7f;
          font-size: 16px;
          line-height: 1.5;
        }

        .guidance-practice-prompt {
          margin-bottom: 20px;
          padding: 0 0 18px;
          border-bottom: 1px solid #d7dde5;
        }

        .guidance-practice-prompt > span {
          display: block;
          margin-bottom: 7px;
          color: #596a7f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .guidance-practice-prompt p {
          margin: 0;
          color: #10233f;
          font-size: 19px;
          line-height: 1.4;
          font-weight: 600;
        }

        .guidance-practice-flow {
          max-height: 370px;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .guidance-practice-upload,
        .guidance-practice-ready,
        .guidance-practice-result {
          display: grid;
          gap: 10px;
        }

        .guidance-practice-upload > span,
        .guidance-practice-file-size {
          color: #718096;
          font-size: 12px;
        }

        .guidance-practice-upload button,
        .guidance-practice-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .guidance-practice-file {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 8px;
          color: #1f559d;
          font-size: 14px;
          font-weight: 700;
        }

        .guidance-practice-file > svg:first-child {
          flex: 0 0 auto;
          color: #1e8a5f;
        }

        .guidance-practice-file > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .guidance-practice-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .guidance-practice-error {
          color: #a33325;
          font-size: 13px;
          line-height: 1.5;
        }

        .guidance-practice-error p {
          margin: 0 0 8px;
        }

        .guidance-practice-generating {
          display: grid;
          gap: 8px;
          color: #596a7f;
          font-size: 13px;
        }

        .guidance-practice-generating strong,
        .guidance-practice-result > strong,
        .guidance-practice-review > strong {
          color: #1f559d;
          font-size: 12px;
          letter-spacing: .04em;
        }

        .guidance-practice-progress,
        .guidance-mcq-progress-track {
          height: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: #e7edf4;
        }

        .guidance-practice-progress span {
          display: block;
          width: 38%;
          height: 100%;
          border-radius: inherit;
          background: #ea580c;
          animation: guidance-practice-loading 1.1s ease-in-out infinite alternate;
        }

        .guidance-mcq-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #596a7f;
          font-size: 11px;
          font-weight: 700;
        }

        .guidance-mcq-progress-track {
          margin-bottom: 13px;
        }

        .guidance-mcq-progress-track span {
          display: block;
          height: 100%;
          background: #1f559d;
          transition: width 180ms ease;
        }

        .guidance-mcq-option.is-selected {
          border-color: #1f559d;
          background: #edf4fb;
          box-shadow: inset 3px 0 #1f559d;
        }

        .guidance-practice-score {
          color: #10233f;
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
        }

        .guidance-practice-percent {
          color: #1f559d;
          font-size: 20px;
          font-weight: 700;
        }

        .guidance-practice-result > p {
          margin: 0;
          color: #596a7f;
          font-size: 14px;
          line-height: 1.5;
        }

        .guidance-practice-review > section {
          margin: 12px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #d7dde5;
          color: #596a7f;
          font-size: 12px;
          line-height: 1.5;
        }

        .guidance-practice-review h3 {
          margin: 0 0 5px;
          color: #10233f;
          font-size: 14px;
        }

        .guidance-practice-review p {
          margin: 3px 0;
          overflow-wrap: anywhere;
        }

        .guidance-practice-review .is-correct {
          color: #1e8a5f;
        }

        .guidance-practice-review .is-incorrect {
          color: #c4432b;
        }

        @keyframes guidance-practice-loading {
          from { transform: translateX(-70%); }
          to { transform: translateX(220%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .guidance-practice-progress span,
          .guidance-mcq-progress-track span {
            animation: none;
            transition: none;
          }
        }

        .guidance-mcq h3 {
          margin: 0 0 14px;
          color: #10233f;
          font-size: 17px;
          line-height: 1.45;
          font-weight: 700;
        }

        .guidance-mcq-options {
          display: grid;
          gap: 8px;
        }

        .guidance-mcq-option {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 9px;
          align-items: start;
          width: 100%;
          padding: 10px;
          border: 1px solid #d7dde5;
          border-radius: 5px;
          background: #fff;
          color: #25364b;
          font: inherit;
          font-size: 14px;
          line-height: 1.45;
          text-align: left;
          cursor: pointer;
        }

        .guidance-mcq-option > span:first-child {
          color: #1f559d;
          font-weight: 700;
        }

        .guidance-mcq-option:hover:not(:disabled) {
          border-color: #1f559d;
          background: #f7f9fc;
        }

        .guidance-mcq-option:focus-visible {
          outline: 2px solid #1f559d;
          outline-offset: 2px;
        }

        .guidance-mcq-option:disabled {
          cursor: default;
        }

        .guidance-mcq-option.is-correct {
          border-color: #1e8a5f;
          background: #e6f4ec;
        }

        .guidance-mcq-option.is-incorrect {
          border-color: #c4432b;
          background: #fbeae6;
        }

        .guidance-mcq-feedback {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #d7dde5;
          color: #25364b;
          font-size: 14px;
          line-height: 1.5;
        }

        .guidance-mcq-feedback strong {
          color: #1e8a5f;
        }

        .guidance-mcq-feedback.is-incorrect strong {
          color: #c4432b;
        }

        .guidance-mcq-feedback p {
          margin: 5px 0 0;
        }

        @media (max-width: 900px) {
          .guidance-practice {
            padding: 22px 0 0;
            border-top: 1px solid #d7dde5;
            border-left: 0;
          }
        }
      `}</style>
    </aside>
  );
}
