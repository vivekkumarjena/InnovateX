import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizBot.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const QuizBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizOver, setQuizOver] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/api/quiz/questions`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  const handleAnswer = (option) => setSelectedAnswer(option);

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].answer) setScore(s => s + 1);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(i => i + 1);
      setSelectedAnswer(null);
    } else {
      setQuizOver(true);
    }
  };

  return (
    <div className="quizbot-container">
      <button className="quiz-toggle" onClick={() => setIsOpen(!isOpen)}>🧠</button>

      {isOpen && (
        <div className="quiz-window">
          <div className="quiz-header">
            <h4>Odisha Quiz</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {quizOver ? (
            <div className="quiz-body">
              <h3>Quiz Over!</h3>
              <p>Your Score: {score} / {questions.length}</p>
            </div>
          ) : (
            <div className="quiz-body">
              {questions.length > 0 && (
                <>
                  <h4>{questions[currentQuestion].question}</h4>
                  <div className="options">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button className="next-btn" onClick={handleNext} disabled={!selectedAnswer}>
                    Next
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizBot;
