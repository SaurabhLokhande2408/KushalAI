import React, { useState } from 'react';
import { Button } from '../common/UI';

const OPTIONS = [
  'A model learns from data without predefined labels.',
  'A model learns from labeled examples containing inputs and known targets.',
  'An agent learns by receiving rewards from an environment.',
  'A model randomly groups data points without using features.'
];

const CORRECT_OPTION = 1;

export default function PracticeQuestion() {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const isCorrect = selectedOption === CORRECT_OPTION;

  function generatePractice() {
    setSelectedOption(null);
    setQuestionVisible(true);
  }

  return (
    <aside className="guidance-practice">
      <div className="guidance-kicker">KNOWLEDGE CHECK</div>
      <h2>Practice</h2>
      <p className="guidance-practice-intro">Test your understanding of the material.</p>

      <div className="guidance-practice-prompt">
        <span>Question</span>
        <p>What is "Supervised learning?"</p>
      </div>

      {!questionVisible ? (
        <Button onClick={generatePractice}>Generate MCQ practice</Button>
      ) : (
        <div className="guidance-mcq">
          <h3>Which statement best describes supervised learning?</h3>
          <div className="guidance-mcq-options" role="group" aria-label="Answer choices">
            {OPTIONS.map((option, index) => {
              const isSelected = selectedOption === index;
              const isAnswer = selectedOption !== null && index === CORRECT_OPTION;
              const isWrongSelection = isSelected && !isCorrect;

              return (
                <button
                  className={`guidance-mcq-option${isAnswer ? ' is-correct' : ''}${isWrongSelection ? ' is-incorrect' : ''}`}
                  type="button"
                  key={option}
                  disabled={selectedOption !== null}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedOption(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`guidance-mcq-feedback${isCorrect ? ' is-correct' : ' is-incorrect'}`} role="status">
              <strong>{isCorrect ? 'Correct' : 'Incorrect'}</strong>
              <p>
                Supervised learning uses labeled training examples. The model learns a mapping from inputs to known targets so it can make predictions on new data.
              </p>
            </div>
          )}
        </div>
      )}

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
