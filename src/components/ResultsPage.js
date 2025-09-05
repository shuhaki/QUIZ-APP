// src/components/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, userAnswers, score } = location.state || {};
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    if (score !== undefined && questions) {
      const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');
      const newScore = {
        score,
        total: questions.length,
        date: new Date().toLocaleDateString(),
        difficulty: questions[0]?.difficulty || 'all'
      };
      
      highScores.push(newScore);
      highScores.sort((a, b) => b.score - a.score);
      
      // Keep top 10 scores
      localStorage.setItem('quizHighScores', JSON.stringify(highScores.slice(0, 10)));
    }
  }, [score, questions]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');
    setHighScores(scores);
  }, []);

  const handleRestartQuiz = () => {
    navigate('/quiz');
  };

  if (!questions) {
    return (
      <div className="results-container">
        <h2>No results available</h2>
        <button onClick={() => navigate('/quiz')} className="restart-button">
          Start New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <div className="score-section">
        <h3>Your Score: {score} / {questions.length}</h3>
        <p>{score >= questions.length / 2 ? 'Great job!' : 'Keep practicing!'}</p>
      </div>
      
      <div className="results-summary">
        <h3>Question Review</h3>
        {questions.map((question, index) => {
          const isCorrect = userAnswers[index] === question.correctAnswer;
          
          return (
            <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <h4>Question {index + 1}: {question.question}</h4>
              <p>Your answer: {userAnswers[index] || 'Not answered'}</p>
              {!isCorrect && <p>Correct answer: {question.correctAnswer}</p>}
            </div>
          );
        })}
      </div>

      {highScores.length > 0 && (
        <div className="high-scores">
          <h3>High Scores</h3>
          <ul>
            {highScores.slice(0, 5).map((scoreItem, index) => (
              <li key={index}>
                {scoreItem.score}/{scoreItem.total} - {scoreItem.date} ({scoreItem.difficulty})
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button onClick={handleRestartQuiz} className="restart-button">
        Restart Quiz
      </button>
    </div>
  );
};

export default ResultsPage;