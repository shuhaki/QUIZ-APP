// Enhanced Question.js with checkmark icon
import React from 'react';

const Question = ({ question, selectedAnswer, onAnswerSelect }) => {
  const handleOptionClick = (option) => {
    onAnswerSelect(option);
  };

  return (
    <div className="question-container">
      <h3 className="question-text">{question.question}</h3>
      <ul className="options-list">
        {question.options.map((option, index) => (
          <li
            key={index}
            className={`option-item ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            <span className="option-text">{option}</span>
            {selectedAnswer === option && (
              <span className="checkmark">✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;