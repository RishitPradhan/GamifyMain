import React, { useState, useEffect } from "react";

// Add Google Fonts for pixelated text
if (!document.querySelector('link[href*="Press+Start+2P"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const CaromCoinGame = () => {
  const INITIAL_COINS = [0, 1, 2, 3, 4];
  const MEDIUM_FORCE = 5;
  const HIGH_FORCE = 8;

  const COIN_HEIGHT = 20; // height of one coin
  const COIN_OFFSET = -5; // negative offset for stacking
  const STACK_TOP = 60; // top position of stack container

  const [coins, setCoins] = useState(INITIAL_COINS);
  const [scatteredCoins, setScatteredCoins] = useState([]);
  const [strikerTop, setStrikerTop] = useState(260); // striker starts near bottom
  const [force, setForce] = useState(0);
  const [striking, setStriking] = useState(false);
  const [particles, setParticles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [strikerGlow, setStrikerGlow] = useState(false);

  // Particle explosion effect
  const createParticles = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + Math.random() * 40 - 20,
        y: y + Math.random() * 40 - 20,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        color: ['#FFD700', '#FFA500', '#FF6347', '#32CD32'][Math.floor(Math.random() * 4)]
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
          life: p.life - 0.05
        })).filter(p => p.life > 0)
      );
    };
    
    const interval = setInterval(animateParticles, 50);
    setTimeout(() => clearInterval(interval), 1000);
  };

  // Striker glow effect
  useEffect(() => {
    if (force > MEDIUM_FORCE) {
      setStrikerGlow(true);
    } else {
      setStrikerGlow(false);
    }
  }, [force]);

  const handleHit = () => {
    if (striking) return;
    if (force < MEDIUM_FORCE) {
      // Create shake animation for insufficient force
      const board = document.querySelector('.carrom-board');
      if (board) {
        board.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => board.style.animation = '', 500);
      }
      return;
    }

    setGameStarted(true);
    setStriking(true);

    // Calculate dynamic position of the bottom coin
    const bottomCoinIndex = coins.length - 1;
    const bottomCoinTop = STACK_TOP + bottomCoinIndex * COIN_OFFSET;

    // Striker moves to touch the bottom coin
    const strikerTarget = bottomCoinTop + COIN_HEIGHT;
    setStrikerTop(strikerTarget);

    // Create impact particles
    createParticles(150, strikerTarget);

    setTimeout(() => {
      if (force >= HIGH_FORCE) {
        // Scatter all coins randomly with enhanced animation
        setScatteredCoins(
          coins.map((_, index) => ({
            top: Math.random() * 200 + 50,
            left: Math.random() * 220 + 20,
            rotate: Math.random() * 720 + 360, // Multiple rotations
            scale: 0.8 + Math.random() * 0.4,
            delay: index * 50 // Staggered animation
          }))
        );
        setCoins([]);
      } else {
        // Remove bottom coin only with bounce effect
        const removedCoin = {
          top: Math.random() * 100 + 150,
          left: Math.random() * 100 + 100,
          rotate: Math.random() * 360,
          scale: 1.2,
          delay: 0
        };
        setScatteredCoins([removedCoin]);
        setCoins((prev) => prev.slice(1));
      }

      // Reset striker back to bottom
      setTimeout(() => {
        setStrikerTop(260);
        setTimeout(() => {
          setScatteredCoins([]);
          setStriking(false);
        }, 300);
      }, 600);
    }, 400);
  };

  const handleReset = () => {
    setCoins(INITIAL_COINS);
    setScatteredCoins([]);
    setStrikerTop(260);
    setForce(0);
    setStriking(false);
    setParticles([]);
    setGameStarted(false);
    setStrikerGlow(false);
  };

  const styles = {
    container: { 
      textAlign: "center", 
      margin: "20px 0", 
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      imageRendering: "pixelated",
      background: "linear-gradient(135deg, #0f0a1f 0%, #1b1233 50%, #2d1b4e 100%)",
      padding: "30px",
      borderRadius: "15px",
      border: "3px solid #7c3aed",
      boxShadow: "0 0 30px rgba(124, 58, 237, 0.4), inset 0 0 20px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden"
    },
    board: {
      position: "relative",
      width: "320px",
      height: "320px",
      margin: "0 auto",
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
      height: "18px",
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
    controls: {
      marginTop: "25px",
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      flexWrap: "wrap",
      alignItems: "center"
    },
    title: {
      fontSize: "1.2rem",
      color: "#e9d5ff",
      textShadow: "0 0 10px rgba(124, 58, 237, 0.8), 2px 2px 0px #4c1d95",
      marginBottom: "20px",
      letterSpacing: "2px",
      animation: "titleGlow 3s ease-in-out infinite"
    },
    forceLabel: {
      fontSize: "0.8rem",
      color: "#c4b5fd",
      textShadow: "1px 1px 0px #4c1d95",
      letterSpacing: "1px"
    },
    slider: {
      width: "150px",
      height: "8px",
      background: "#4c1d95",
      borderRadius: "4px",
      outline: "none",
      border: "2px solid #7c3aed",
      cursor: "pointer",
      imageRendering: "pixelated"
    },
    button: {
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      fontSize: "0.7rem",
      padding: "12px 20px",
      border: "3px solid #7c3aed",
      borderRadius: "8px",
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      color: "#ffffff",
      cursor: "pointer",
      textShadow: "1px 1px 0px #4c1d95",
      boxShadow: "0 4px 0 #4c1d95, 0 0 15px rgba(124, 58, 237, 0.3)",
      transition: "all 0.1s ease",
      imageRendering: "pixelated",
      letterSpacing: "1px"
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

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes titleGlow {
        0%, 100% { text-shadow: 0 0 10px rgba(124, 58, 237, 0.8), 2px 2px 0px #4c1d95; }
        50% { text-shadow: 0 0 20px rgba(124, 58, 237, 1), 2px 2px 0px #4c1d95, 0 0 30px rgba(124, 58, 237, 0.5); }
      }
      @keyframes boardGlow {
        0%, 100% { box-shadow: inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(139, 69, 19, 0.3), 0 0 20px rgba(124, 58, 237, 0.3), 0 8px 16px rgba(0,0,0,0.4); }
        50% { box-shadow: inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(139, 69, 19, 0.3), 0 0 40px rgba(124, 58, 237, 0.6), 0 8px 16px rgba(0,0,0,0.4); }
      }
      @keyframes coinFloat {
        0% { transform: perspective(100px) rotateX(0deg) translateY(0px); }
        100% { transform: perspective(100px) rotateX(5deg) translateY(-2px); }
      }
      @keyframes coinSpin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(720deg) scale(1.1); }
      }
      @keyframes coinGlow {
        0%, 100% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255, 215, 0, 0.7); }
        50% { box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 25px rgba(255, 215, 0, 1); }
      }
      @keyframes strikerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.title}>🎯 PIXELATED CARROM STRIKE</div>
      <div style={styles.board} className="carrom-board">
        <div style={styles.stack}>
          {coins.map((_, i) => (
            <div key={i} style={styles.coin(i)} />
          ))}
        </div>
        {scatteredCoins.map((c, i) => (
          <div key={i} style={styles.scatteredCoin(c, i)} />
        ))}
        {particles.map((particle) => (
          <div key={particle.id} style={styles.particle(particle)} />
        ))}
        <div style={styles.striker} />
      </div>

      <div style={styles.controls}>
        <label style={styles.forceLabel}>⚡ FORCE:</label>
        <input
          type="range"
          min="0"
          max="10"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          style={{
            ...styles.slider,
            background: force > MEDIUM_FORCE ? 
              `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force * 10}%, #4c1d95 100%)` : 
              `linear-gradient(to right, #ef4444 0%, #f87171 ${force * 10}%, #4c1d95 100%)`
          }}
        />
        <span style={{...styles.forceLabel, marginLeft: '10px'}}>{force}/10</span>
        <button 
          onClick={handleHit} 
          disabled={striking} 
          style={{
            ...styles.button,
            transform: striking ? "translateY(4px)" : "translateY(0)",
            boxShadow: striking ? "0 0 0 #4c1d95, 0 0 15px rgba(124, 58, 237, 0.3)" : "0 4px 0 #4c1d95, 0 0 15px rgba(124, 58, 237, 0.3)",
            background: force < MEDIUM_FORCE ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)"
          }}
          onMouseEnter={(e) => {
            if (!striking) e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            if (!striking) e.target.style.transform = "translateY(0)";
          }}
        >
          {striking ? "🔥 STRIKING..." : "🎯 HIT"}
        </button>
        <button 
          onClick={handleReset} 
          disabled={striking}
          style={{
            ...styles.button,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            transform: striking ? "translateY(4px)" : "translateY(0)",
            boxShadow: striking ? "0 0 0 #92400e, 0 0 15px rgba(245, 158, 11, 0.3)" : "0 4px 0 #92400e, 0 0 15px rgba(245, 158, 11, 0.3)"
          }}
          onMouseEnter={(e) => {
            if (!striking) e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            if (!striking) e.target.style.transform = "translateY(0)";
          }}
        >
          🔄 RESET
        </button>
      </div>
    </div>
  );
};

export default CaromCoinGame;