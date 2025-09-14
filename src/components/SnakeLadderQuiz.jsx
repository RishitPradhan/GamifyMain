import React, { useState, useEffect } from "react";
import "./SnakeLadderQuiz.css";

// Pixelated CSS styles
const pixelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .pixel-font {
    font-family: 'Press Start 2P', 'Courier New', monospace;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    text-shadow: 2px 2px 0px #000000;
    letter-spacing: 1px;
    font-weight: bold;
    -webkit-font-smoothing: none;
    font-smooth: never;
  }
  
  .pixel-element {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    image-rendering: -webkit-crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
  
  .pixel-button {
    font-family: 'Press Start 2P', 'Courier New', monospace;
    image-rendering: pixelated;
    border: 3px solid #333;
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: #fff;
    padding: 12px 20px;
    cursor: pointer;
    letter-spacing: 1px;
    font-size: 10px;
    text-shadow: 1px 1px 0px #000000;
    transition: all 0.2s ease;
  }
  
  .pixel-button:hover {
    background: linear-gradient(135deg, #357abd, #2c5aa0);
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.7);
    transform: scale(1.05);
  }
  
  .pixel-input {
    font-family: 'Press Start 2P', 'Courier New', monospace;
    image-rendering: pixelated;
    border: 3px solid #333;
    background: #f0f0f0;
    padding: 8px;
    font-size: 10px;
    letter-spacing: 1px;
    text-align: center;
  }
  
  .glow-text {
    animation: textGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes textGlow {
    from { text-shadow: 0 0 10px #00ff00, 2px 2px 0px #000000; }
    to { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 2px 2px 0px #000000; }
  }
  
  .pulse-animation {
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .shake-animation {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = pixelStyles;
  document.head.appendChild(styleSheet);
}

const quizQuestions = {
  easy: [
    { q: "A force of 20 N acts on a 5 kg body. Find acceleration.", ans: 4 },
    { q: "Force = 12 N and mass = 6 kg. Find acceleration.", ans: 2 },
    { q: "A 3 kg object accelerates at 5 m/s². Find force.", ans: 15 },
    { q: "Find force: mass = 2 kg, acceleration = 10 m/s².", ans: 20 },
    { q: "A 10 kg object accelerates at 1 m/s². Find force.", ans: 10 },
    { q: "If mass = 8 kg and F = 24 N, find acceleration.", ans: 3 }
  ],
  medium: [
    { q: "Force = 25 N, mass = 10 kg. Find acceleration.", ans: 2.5 },
    { q: "A 1000 kg car accelerates at 2 m/s². Find force.", ans: 2000 },
    { q: "Mass = 50 kg, acceleration = 0.5 m/s². Force?", ans: 25 },
    { q: "A 200 N force acts on a 100 kg object. Find acceleration.", ans: 2 },
    { q: "A bike (150 kg) accelerates at 1.5 m/s². Find force.", ans: 225 },
    { q: "Force = 45 N, mass = 15 kg. Find acceleration.", ans: 3 }
  ],
  hard: [
    { q: "Bullet of mass 0.005 kg at velocity 500 m/s. Momentum?", ans: 2.5 },
    { q: "Truck mass = 2000 kg, force = 4000 N. Acceleration?", ans: 2 },
    { q: "Force = 100 N on 20 kg body. Time to reach 50 m/s from rest?", ans: 10 },
    { q: "1000 kg body. If momentum change = 2000 kg m/s in 4s, find force.", ans: 500 },
    { q: "A rocket ejects gases of 2 kg/s with velocity 500 m/s. Find thrust.", ans: 1000 },
    { q: "Force of 300 N acts for 5s. Momentum change?", ans: 1500 }
  ]
};

const hurdles = [8, 15, 22]; // Positions for hard questions
const easySpots = [5, 12, 20, 27]; // Positions for easy questions

const SnakeLadderQuiz = () => {
  const [position, setPosition] = useState(1);
  const [dice, setDice] = useState(null);
  const [question, setQuestion] = useState(null);
  const [inputAns, setInputAns] = useState("");
  const [message, setMessage] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState({
    easy: [],
    medium: [],
    hard: []
  });
  const [isRolling, setIsRolling] = useState(false);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);

  const rollDice = () => {
    if (gameWon || isRolling) return;
    setIsRolling(true);
    setDice(null);
    
    // Animated dice rolling effect
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll);
        let newPos = position + finalRoll;
        if (newPos > 30) newPos = 30;
        setIsRolling(false);
        setTimeout(() => askQuestion(newPos), 800);
      }
    }, 150);
  };

  const askQuestion = (spot) => {
    let difficulty = "medium";
    if (hurdles.includes(spot)) difficulty = "hard";
    else if (easySpots.includes(spot)) difficulty = "easy";

    let availableQs = quizQuestions[difficulty].filter(
      (qs, i) => !usedQuestions[difficulty].includes(i)
    );

    if (availableQs.length === 0) {
      // reset if all used
      setUsedQuestions((prev) => ({ ...prev, [difficulty]: [] }));
      availableQs = [...quizQuestions[difficulty]];
    }

    const randomIndex = Math.floor(Math.random() * availableQs.length);
    const selected = availableQs[randomIndex];
    const qsIndex = quizQuestions[difficulty].indexOf(selected);

    setUsedQuestions((prev) => ({
      ...prev,
      [difficulty]: [...prev[difficulty], qsIndex]
    }));

    setQuestion({ ...selected, spot });
    setMessage(
      `Answer the ${difficulty.toUpperCase()} question to move!`
    );
  };

  const checkAnswer = () => {
    if (!question) return;
    if (parseFloat(inputAns) === question.ans) {
      setShowCorrectAnimation(true);
      setMessage("🎯 CORRECT! MOVING AHEAD...");
      setTimeout(() => {
        setPosition(question.spot);
        if (question.spot >= 30) {
          setGameWon(true);
          setMessage("🏆 VICTORY! YOU WON THE QUIZ GAME! 🏆");
        }
        setShowCorrectAnimation(false);
      }, 1000);
    } else {
      setShowWrongAnimation(true);
      let back = Math.max(1, position - 3);
      setMessage("❌ WRONG! MOVING 3 STEPS BACK!");
      setTimeout(() => {
        setPosition(back);
        setShowWrongAnimation(false);
      }, 1000);
    }
    setQuestion(null);
    setInputAns("");
    setDice(null);
  };

  const resetGame = () => {
    setPosition(1);
    setDice(null);
    setQuestion(null);
    setInputAns("");
    setMessage("🎮 GAME RESET! READY TO PLAY!");
    setGameWon(false);
    setUsedQuestions({ easy: [], medium: [], hard: [] });
    setIsRolling(false);
    setShowCorrectAnimation(false);
    setShowWrongAnimation(false);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f0a1f 0%, #1b1233 50%, #2d1b4e 100%)",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      color: "#e9ecff",
      textAlign: "center"
    }}>
      <h1 className="pixel-font glow-text" style={{
        fontSize: "16px",
        marginBottom: "20px",
        color: "#00aaff",
        textShadow: "0 0 20px #00aaff, 3px 3px 0px #000000",
        letterSpacing: "2px"
      }}>🐍 SNAKE & LADDER QUIZ CHALLENGE 🪜</h1>
      
      <div className="board" style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 70px)",
        gridGap: "8px",
        justifyContent: "center",
        margin: "30px auto",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.3)",
        borderRadius: "15px",
        border: "3px solid #7c3aed",
        boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)"
      }}>
        {[...Array(30)].map((_, i) => {
          const num = 30 - i;
          let cellStyle = {
            width: "70px",
            height: "70px",
            border: "3px solid #333",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "10px",
            fontWeight: "bold",
            background: "#ddd",
            transition: "all 0.3s ease",
            imageRendering: "pixelated",
            color: "#000",
            textShadow: "1px 1px 0px #fff"
          };
          
          if (position === num) {
            cellStyle.background = "linear-gradient(135deg, #ffd700, #ffed4e)";
            cellStyle.boxShadow = "0 0 20px #ffd700";
            cellStyle.transform = "scale(1.1)";
            cellStyle.animation = "pulse 1s ease-in-out infinite";
          }
          if (hurdles.includes(num)) {
            cellStyle.background = "linear-gradient(135deg, #dc2626, #991b1b)";
            cellStyle.color = "#fff";
            cellStyle.textShadow = "1px 1px 0px #000";
          }
          if (easySpots.includes(num)) {
            cellStyle.background = "linear-gradient(135deg, #10b981, #059669)";
            cellStyle.color = "#fff";
            cellStyle.textShadow = "1px 1px 0px #000";
          }
          
          return (
            <div key={num} style={cellStyle} className={position === num ? "pulse-animation" : ""}>
              {hurdles.includes(num) && "🐍"}
              {easySpots.includes(num) && "🪜"}
              <br/>{num}
            </div>
          );
        })}
      </div>

      <div className="controls" style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {!gameWon && (
          <button 
            onClick={rollDice} 
            className={`pixel-button ${isRolling ? 'shake-animation' : ''}`}
            disabled={isRolling}
            style={{
              background: isRolling ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #10b981, #059669)",
              fontSize: "12px",
              padding: "15px 25px"
            }}
          >
            {isRolling ? "🎲 ROLLING..." : "🎲 ROLL DICE"}
          </button>
        )}
        <button onClick={resetGame} className="pixel-button" style={{
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          fontSize: "12px",
          padding: "15px 25px"
        }}>
          🔄 RESET GAME
        </button>
      </div>

      {dice !== null && (
        <div className="pixel-font" style={{
          marginTop: "15px",
          fontSize: "14px",
          color: "#ffd700",
          textShadow: "0 0 10px #ffd700, 2px 2px 0px #000000",
          animation: "pulse 1s ease-in-out"
        }}>
          🎲 DICE ROLLED: {dice}
        </div>
      )}

      {question && (
        <div style={{
          marginTop: "25px",
          border: "4px solid #7c3aed",
          padding: "20px",
          maxWidth: "400px",
          margin: "25px auto 0",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "15px",
          boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)"
        }}>
          <p className="pixel-font" style={{
            fontSize: "10px",
            color: "#00ff00",
            marginBottom: "15px",
            textShadow: "1px 1px 0px #000000",
            lineHeight: "1.5"
          }}>{question.q}</p>
          <input
            className="pixel-input"
            type="number"
            value={inputAns}
            onChange={(e) => setInputAns(e.target.value)}
            style={{
              marginBottom: "15px",
              width: "150px",
              fontSize: "12px"
            }}
            placeholder="ANSWER"
          />
          <br/>
          <button 
            onClick={checkAnswer} 
            className="pixel-button"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              fontSize: "10px",
              padding: "12px 20px"
            }}
          >
            ⚡ SUBMIT ANSWER
          </button>
        </div>
      )}

      <div className={`pixel-font ${showCorrectAnimation ? 'glow-text pulse-animation' : ''} ${showWrongAnimation ? 'shake-animation' : ''}`} style={{
        marginTop: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        color: showCorrectAnimation ? "#00ff00" : showWrongAnimation ? "#ff0000" : "#ffd700",
        textShadow: "2px 2px 0px #000000",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {message}
      </div>
    </div>
  );
};

export default SnakeLadderQuiz;