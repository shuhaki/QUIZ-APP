// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState('all');
  
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-container">
            <h1>Quiz Challenge</h1>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="difficulty-selector"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<QuizPage difficulty={difficulty} />} />
            <Route path="/quiz" element={<QuizPage difficulty={difficulty} />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;