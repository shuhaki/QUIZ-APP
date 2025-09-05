// src/components/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ time, onTimeUp, isPaused }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    setSeconds(time);
  }, [time]);

  useEffect(() => {
    if (isPaused || seconds === 0) return;
    
    const timerId = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds, isPaused]);

  useEffect(() => {
    if (seconds === 0) {
      onTimeUp();
    }
  }, [seconds, onTimeUp]);

  return (
    <div className={`timer ${seconds <= 10 ? 'warning' : ''}`}>
      Time: {seconds}s
    </div>
  );
};

export default Timer;