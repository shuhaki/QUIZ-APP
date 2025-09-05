// src/components/QuizPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import questionsData from '../data/questions.json';

const QuizPage = ({ difficulty = 'all' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timePerQuestion] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let filteredQuestions = questionsData.questions;
        
        if (difficulty !== 'all') {
          filteredQuestions = questionsData.questions.filter(
            q => q.difficulty === difficulty
          );
        }
        
        if (filteredQuestions.length === 0) {
          throw new Error(`No ${difficulty} questions available`);
        }
        
        const shuffledQuestions = shuffleArray(filteredQuestions).map(question => ({
          ...question,
          options: shuffleArray(question.options)
        }));
        
        setQuestions(shuffledQuestions);
        setUserAnswers(Array(shuffledQuestions.length).fill(null));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [difficulty]);

  const calculateScore = useCallback(() => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index]?.correctAnswer ? score + 1 : score;
    }, 0);
  }, [userAnswers, questions]);

  useEffect(() => {
    if (isQuizCompleted) {
      const score = calculateScore();
      navigate('/results', { state: { questions, userAnswers, score } });
    }
  }, [isQuizCompleted, navigate, questions, userAnswers, calculateScore]);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    handleNextQuestion();
  };

  // Loading and error states
  if (isLoading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Quiz</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Questions Available</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="quiz-container">
      <ProgressBar progress={progress} />
      <div className="quiz-header">
        <div className="question-count">
          Question {currentQuestionIndex + 1} of {questions.length}
          <span 
            style={{
              backgroundColor: getDifficultyColor(currentQuestion.difficulty),
              color: currentQuestion.difficulty === 'medium' ? '#333' : 'white',
              padding: '0.3rem 0.8rem',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginLeft: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            {currentQuestion.difficulty}
          </span>
        </div>
        <Timer 
          key={currentQuestionIndex} 
          time={timePerQuestion} 
          onTimeUp={handleTimeUp} 
          isPaused={false}
        />
      </div>
      
      <Question
        question={currentQuestion}
        selectedAnswer={userAnswers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
      />
      
      <div className="navigation-buttons">
        <button 
          onClick={handlePrevQuestion} 
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          Previous
        </button>
        
        <button 
          onClick={handleNextQuestion} 
          disabled={!userAnswers[currentQuestionIndex]}
          className="nav-button next"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;