import React, { useState, useEffect } from "react";

// Add Google Fonts for pixelated text
if (!document.querySelector('link[href*="Press+Start+2P"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const CarromCoinGame = () => {
  const INITIAL_COINS = [0, 1, 2, 3, 4];
  const MEDIUM_FORCE = 5;
  const HIGH_FORCE = 8;

  const COIN_HEIGHT = 20; // height of one coin
  const COIN_OFFSET = 5; // offset between stacked coins
  const STACK_TOP = 80; // top position of the stack

  const [coins, setCoins] = useState(INITIAL_COINS);
  const [scatteredCoins, setScatteredCoins] = useState([]);
  const [strikerTop, setStrikerTop] = useState(250);
  const [force, setForce] = useState(3);
  const [striking, setStriking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [strikerGlow, setStrikerGlow] = useState(false);
  const [particles, setParticles] = useState([]);

  // Particle explosion effect
  const createParticles = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      newParticles.push({
        id: Date.now() + i,
        x: x + Math.random() * 30 - 15,
        y: y + Math.random() * 30 - 15,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
        life: 1.0,
        color: ['#FFD700', '#FF6347', '#32CD32', '#FF69B4', '#00BFFF'][Math.floor(Math.random() * 5)]
      });
    }
    setParticles(newParticles);
    
    // Animate particles
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.03
        })).filter(p => p.life > 0)
      );
    };
    
    const interval = setInterval(animateParticles, 50);
    setTimeout(() => clearInterval(interval), 1500);
  };

  const handleHit = () => {
    if (striking) return;
    if (force < MEDIUM_FORCE) {
      alert("Not enough force! Increase the slider.");
      return;
    }
    setStriking(true);
    setGameStarted(true);
    setStrikerGlow(true);
    createParticles(160, 120);

    // Animate striker
    setStrikerTop(120);

    setTimeout(() => {
      // Scatter coins
      const scattered = coins.map((_, i) => ({
        top: Math.random() * 200 + 50,
        left: Math.random() * 200 + 50,
        rotate: Math.random() * 720 - 360,
        scale: 0.8 + Math.random() * 0.4,
        delay: i * 100
      }));
      setScatteredCoins(scattered);
      setCoins([]);
      
      setTimeout(() => {
        setStrikerTop(250);
        setStriking(false);
      }, 800);
    }, 600);
  };

  const resetGame = () => {
    setCoins(INITIAL_COINS);
    setScatteredCoins([]);
    setStrikerTop(250);
    setForce(3);
    setStriking(false);
    setParticles([]);
    setGameStarted(false);
    setStrikerGlow(false);
  };

  const carromStyles = {
    board: {
      position: "relative",
      width: "320px",
      height: "320px",
      margin: "0 auto 20px",
      background: `
        radial-gradient(circle at 30% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(160, 82, 45, 0.2) 0%, transparent 50%),
        linear-gradient(45deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #D2B48C 75%, #F5DEB3 100%)
      `,
      border: "6px solid #654321",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: `
        inset 0 0 30px rgba(0,0,0,0.5),
        inset 0 0 60px rgba(139, 69, 19, 0.3),
        0 0 20px rgba(124, 58, 237, 0.3),
        0 8px 16px rgba(0,0,0,0.4)
      `,
      imageRendering: "pixelated",
      animation: gameStarted ? "boardGlow 2s ease-in-out infinite" : "none"
    },
    stack: {
      position: "absolute",
      top: `${STACK_TOP}px`,
      left: "120px",
      width: "80px",
      height: "120px",
    },
    coin: (index) => ({
      position: "absolute",
      width: "80px",
      height: `${COIN_HEIGHT}px`,
      borderRadius: "50%",
      background: `
        radial-gradient(circle at 30% 30%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #DAA520 100%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)
      `,
      border: "3px solid #B8860B",
      top: `${index * COIN_OFFSET}px`,
      transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      zIndex: 100 - index,
      imageRendering: "pixelated",
      boxShadow: `
        0 ${index * 2 + 2}px ${index * 2 + 4}px rgba(0,0,0,0.3),
        inset 0 2px 4px rgba(255,255,255,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.2),
        0 0 10px rgba(255, 215, 0, 0.5)
      `,
      animation: `coinFloat ${2 + index * 0.5}s ease-in-out infinite alternate`,
      transform: `perspective(100px) rotateX(${index * 2}deg)`
    }),
    scatteredCoin: (coin, index) => ({
      position: "absolute",
      width: "80px",
      height: `${COIN_HEIGHT}px`,
      borderRadius: "50%",
      background: `
        radial-gradient(circle at 30% 30%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #DAA520 100%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)
      `,
      border: "3px solid #B8860B",
      top: `${coin.top}px`,
      left: `${coin.left}px`,
      transform: `rotate(${coin.rotate}deg) scale(${coin.scale || 1})`,
      transition: `all ${0.8 + index * 0.2}s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${coin.delay || 0}ms`,
      zIndex: 10 + index,
      imageRendering: "pixelated",
      boxShadow: `
        0 4px 8px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.2),
        0 0 15px rgba(255, 215, 0, 0.7)
      `,
      animation: "coinSpin 1s ease-out, coinGlow 2s ease-in-out infinite"
    }),
    striker: {
      position: "absolute",
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background: `
        radial-gradient(ellipse at 30% 30%, #E6E6FA 0%, #C0C0C0 30%, #A9A9A9 60%, #808080 100%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)
      `,
      border: "3px solid #696969",
      left: "125px",
      top: `${strikerTop}px`,
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      zIndex: 200,
      imageRendering: "pixelated",
      boxShadow: `
        0 4px 8px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.6),
        inset 0 -2px 4px rgba(0,0,0,0.3),
        ${strikerGlow ? '0 0 20px rgba(138, 43, 226, 0.8), 0 0 40px rgba(138, 43, 226, 0.4)' : '0 0 10px rgba(192, 192, 192, 0.5)'}
      `,
      animation: strikerGlow ? "strikerPulse 1s ease-in-out infinite" : "none",
      transform: striking ? "scale(1.1)" : "scale(1)"
    },
    particle: (particle) => ({
      position: "absolute",
      width: "4px",
      height: "4px",
      background: particle.color,
      borderRadius: "50%",
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      opacity: particle.life,
      pointerEvents: "none",
      zIndex: 300,
      boxShadow: `0 0 6px ${particle.color}`,
      imageRendering: "pixelated"
    })
  };

  return (
    <div style={{marginBottom: "30px"}}>
      <h3 style={{fontSize: "1rem", color: "#e9d5ff", textAlign: "center", marginBottom: "15px"}}>
        🎯 PIXELATED CARROM STRIKE
      </h3>
      <div style={carromStyles.board}>
        <div style={carromStyles.stack}>
          {coins.map((_, i) => (
            <div key={i} style={carromStyles.coin(i)} />
          ))}
        </div>
        {scatteredCoins.map((c, i) => (
          <div key={i} style={carromStyles.scatteredCoin(c, i)} />
        ))}
        {particles.map((particle) => (
          <div key={particle.id} style={carromStyles.particle(particle)} />
        ))}
        <div style={carromStyles.striker} />
      </div>
      <div style={{textAlign: "center", marginBottom: "10px"}}>
        <label style={{fontSize: "0.7rem", color: "#c4b5fd", marginRight: "10px"}}>
          ⚡ FORCE: {force}/10
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          style={{
            width: "120px",
            height: "6px",
            background: force > MEDIUM_FORCE ? 
              `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force * 10}%, #4c1d95 100%)` : 
              `linear-gradient(to right, #ef4444 0%, #f87171 ${force * 10}%, #4c1d95 100%)`,
            borderRadius: "3px",
            outline: "none",
            border: "2px solid #7c3aed",
            cursor: "pointer",
            imageRendering: "pixelated"
          }}
        />
      </div>
      <div style={{textAlign: "center", display: "flex", gap: "10px", justifyContent: "center"}}>
        <button 
          onClick={handleHit} 
          disabled={striking} 
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            padding: "8px 15px",
            border: "2px solid #7c3aed",
            borderRadius: "6px",
            background: force < MEDIUM_FORCE ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "#ffffff",
            cursor: "pointer",
            textShadow: "1px 1px 0px #4c1d95",
            boxShadow: striking ? "0 0 0 #4c1d95" : "0 3px 0 #4c1d95",
            transform: striking ? "translateY(3px)" : "translateY(0)",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
          }}
        >
          {striking ? "🔥 STRIKING..." : "🎯 HIT"}
        </button>
        <button 
          onClick={resetGame}
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            padding: "8px 15px",
            border: "2px solid #7c3aed",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#ffffff",
            cursor: "pointer",
            textShadow: "1px 1px 0px #4c1d95",
            boxShadow: "0 3px 0 #92400e",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
          }}
        >
          🔄 RESET
        </button>
      </div>
    </div>
  );
};

const PushBallChallenge = () => {
  const [position, setPosition] = useState(0);
  const [force, setForce] = useState(5);
  const [isMoving, setIsMoving] = useState(false);
  const [particles, setParticles] = useState([]);
  const [ballGlow, setBallGlow] = useState(false);

  const pushLeft = () => {
    setIsMoving(true);
    createParticles(250 + position, 100, 'left');
    setPosition((prev) => Math.max(prev - force * 10, -200));
    setTimeout(() => setIsMoving(false), 300);
  };

  const pushRight = () => {
    setIsMoving(true);
    createParticles(250 + position, 100, 'right');
    setPosition((prev) => Math.min(prev + force * 10, 200));
    setTimeout(() => setIsMoving(false), 300);
  };

  const reset = () => {
    setPosition(0);
    setParticles([]);
    setBallGlow(false);
  };

  const createParticles = (x, y, direction) => {
    const newParticles = [];
    for (let i = 0; i < 12; i++) {
      const angle = direction === 'left' ? Math.PI + (Math.random() - 0.5) * Math.PI/2 : (Math.random() - 0.5) * Math.PI/2;
      newParticles.push({
        id: Date.now() + i,
        x: x + Math.random() * 15 - 7,
        y: y + Math.random() * 15 - 7,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
        life: 1.0,
        color: ['#FFD700', '#FF6347', '#32CD32', '#FF69B4', '#00BFFF'][Math.floor(Math.random() * 5)]
      });
    }
    setParticles(newParticles);
    
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.04
        })).filter(p => p.life > 0)
      );
    };
    
    const interval = setInterval(animateParticles, 50);
    setTimeout(() => clearInterval(interval), 1000);
  };

  useEffect(() => {
    setBallGlow(force > 10);
  }, [force]);

  const pushBallStyles = {
    arena: {
      position: "relative",
      width: "400px",
      height: "120px",
      margin: "0 auto 15px",
      background: `
        radial-gradient(circle at 30% 30%, rgba(0, 255, 127, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(50, 205, 50, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #228B22 0%, #32CD32 25%, #00FF7F 50%, #98FB98 75%, #F0FFF0 100%)
      `,
      border: "3px solid #00FF7F",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: `
        inset 0 0 20px rgba(0,255,127,0.3),
        0 0 15px rgba(0,255,127,0.2)
      `,
      imageRendering: "pixelated"
    },
    ball: {
      position: "absolute",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: `
        radial-gradient(circle at 30% 30%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #FF6347 100%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)
      `,
      border: "2px solid #FF4500",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translateX(${position}px) ${isMoving ? 'scale(1.15)' : 'scale(1)'}`,
      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      zIndex: 10,
      imageRendering: "pixelated",
      boxShadow: `
        0 4px 8px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.3),
        inset 0 -2px 4px rgba(0,0,0,0.3),
        ${ballGlow ? '0 0 20px rgba(255, 215, 0, 1)' : '0 0 10px rgba(255, 215, 0, 0.5)'}
      `,
      animation: isMoving ? "ballBounce 0.3s ease-out" : (ballGlow ? "ballGlow 2s ease-in-out infinite" : "none")
    },
    particle: (particle) => ({
      position: "absolute",
      width: "4px",
      height: "4px",
      background: particle.color,
      borderRadius: "50%",
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      opacity: particle.life,
      pointerEvents: "none",
      zIndex: 20,
      boxShadow: `0 0 6px ${particle.color}`,
      imageRendering: "pixelated"
    })
  };

  return (
    <div>
      <h3 style={{fontSize: "1rem", color: "#e9d5ff", textAlign: "center", marginBottom: "15px"}}>
        ⚽ PIXELATED BALL PUSH CHALLENGE
      </h3>
      <div style={{textAlign: "center", marginBottom: "15px"}}>
        <label style={{fontSize: "0.7rem", color: "#c4b5fd", marginRight: "10px"}}>
          ⚡ FORCE: {force}/20
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          style={{
            width: "150px",
            height: "6px",
            background: force > 10 ? 
              `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force * 5}%, #4c1d95 100%)` : 
              `linear-gradient(to right, #ef4444 0%, #f87171 ${force * 5}%, #4c1d95 100%)`,
            borderRadius: "3px",
            outline: "none",
            border: "2px solid #7c3aed",
            cursor: "pointer",
            imageRendering: "pixelated"
          }}
        />
      </div>
      <div style={pushBallStyles.arena}>
        <div style={pushBallStyles.ball}></div>
        {particles.map((particle) => (
          <div key={particle.id} style={pushBallStyles.particle(particle)} />
        ))}
      </div>
      <div style={{textAlign: "center", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
        <button 
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            padding: "8px 15px",
            border: "2px solid #ef4444",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#ffffff",
            cursor: "pointer",
            textShadow: "1px 1px 0px #991b1b",
            boxShadow: "0 3px 0 #991b1b",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
          }}
          onClick={pushLeft}
        >
          ⬅ PUSH LEFT
        </button>
        <button 
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            padding: "8px 15px",
            border: "2px solid #10b981",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#ffffff",
            cursor: "pointer",
            textShadow: "1px 1px 0px #047857",
            boxShadow: "0 3px 0 #047857",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
          }}
          onClick={pushRight}
        >
          PUSH RIGHT ➡
        </button>
        <button 
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            padding: "8px 15px",
            border: "2px solid #f59e0b",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#ffffff",
            cursor: "pointer",
            textShadow: "1px 1px 0px #92400e",
            boxShadow: "0 3px 0 #92400e",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
          }}
          onClick={reset}
        >
          🔄 RESET
        </button>
      </div>
    </div>
  );
};

export default function CombinedGamesContainer() {
  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes titleGlow {
        0%, 100% { text-shadow: 0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347; }
        50% { text-shadow: 0 0 25px rgba(255, 215, 0, 1), 2px 2px 0px #FF6347, 0 0 35px rgba(255, 215, 0, 0.5); }
      }
      @keyframes coinFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      @keyframes coinSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes coinGlow {
        0%, 100% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255, 215, 0, 0.7); }
        50% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 25px rgba(255, 215, 0, 1); }
      }
      @keyframes strikerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes boardGlow {
        0%, 100% { box-shadow: inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(139, 69, 19, 0.3), 0 0 20px rgba(124, 58, 237, 0.3), 0 8px 16px rgba(0,0,0,0.4); }
        50% { box-shadow: inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(139, 69, 19, 0.3), 0 0 30px rgba(124, 58, 237, 0.5), 0 8px 16px rgba(0,0,0,0.4); }
      }
      @keyframes ballBounce {
        0%, 100% { transform: scale(1) translateY(0px); }
        50% { transform: scale(1.1) translateY(-3px); }
      }
      @keyframes ballGlow {
        0%, 100% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255, 215, 0, 0.5); }
        50% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255, 215, 0, 1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const containerStyles = {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    imageRendering: "pixelated",
    background: "linear-gradient(135deg, #0f0a1f 0%, #1b1233 50%, #2d1b4e 100%)",
    padding: "30px",
    borderRadius: "15px",
    border: "3px solid #7c3aed",
    boxShadow: "0 0 30px rgba(124, 58, 237, 0.4), inset 0 0 20px rgba(0,0,0,0.3)",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
    maxWidth: "700px",
    margin: "20px auto"
  };

  const mainTitleStyles = {
    fontSize: "1.4rem",
    color: "#FFD700",
    textShadow: "0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347",
    marginBottom: "30px",
    letterSpacing: "2px",
    animation: "titleGlow 3s ease-in-out infinite"
  };

  return (
    <div style={containerStyles}>
      <h2 style={mainTitleStyles}>🎮 PIXELATED PHYSICS GAMES</h2>
      <CarromCoinGame />
      <PushBallChallenge />
    </div>
  );
}