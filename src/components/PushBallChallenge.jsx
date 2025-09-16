import React, { useState, useEffect } from "react";

// Add Google Fonts for pixelated text
if (!document.querySelector('link[href*="Press+Start+2P"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function PushBallChallenge() {
  const [position, setPosition] = useState(0);
  const [force, setForce] = useState(5);
  const [isMoving, setIsMoving] = useState(false);
  const [particles, setParticles] = useState([]);
  const [ballGlow, setBallGlow] = useState(false);

  const pushLeft = () => {
    setIsMoving(true);
    createParticles(250 + position, 150, 'left');
    setPosition((prev) => Math.max(prev - force * 10, -200)); // limit left
    setTimeout(() => setIsMoving(false), 300);
  };

  const pushRight = () => {
    setIsMoving(true);
    createParticles(250 + position, 150, 'right');
    setPosition((prev) => Math.min(prev + force * 10, 200)); // limit right
    setTimeout(() => setIsMoving(false), 300);
  };

  const reset = () => {
    setPosition(0);
    setParticles([]);
    setBallGlow(false);
  };

  // Particle explosion effect
  const createParticles = (x, y, direction) => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      const angle = direction === 'left' ? Math.PI + (Math.random() - 0.5) * Math.PI/2 : (Math.random() - 0.5) * Math.PI/2;
      newParticles.push({
        id: Date.now() + i,
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        vx: Math.cos(angle) * (3 + Math.random() * 4),
        vy: Math.sin(angle) * (3 + Math.random() * 4),
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
          life: p.life - 0.04
        })).filter(p => p.life > 0)
      );
    };
    
    const interval = setInterval(animateParticles, 50);
    setTimeout(() => clearInterval(interval), 1200);
  };

  // Ball glow effect based on force
  useEffect(() => {
    if (force > 10) {
      setBallGlow(true);
    } else {
      setBallGlow(false);
    }
  }, [force]);

  // Add CSS styles and animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes titleGlow {
        0%, 100% { text-shadow: 0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347; }
        50% { text-shadow: 0 0 25px rgba(255, 215, 0, 1), 2px 2px 0px #FF6347, 0 0 35px rgba(255, 215, 0, 0.5); }
      }
      @keyframes ballBounce {
        0%, 100% { transform: scale(1) translateY(0px); }
        50% { transform: scale(1.1) translateY(-5px); }
      }
      @keyframes ballGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), inset 0 4px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.3); }
        50% { box-shadow: 0 0 35px rgba(255, 215, 0, 1), inset 0 4px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.3); }
      }
      @keyframes arenaGlow {
        0%, 100% { box-shadow: inset 0 0 30px rgba(0,255,127,0.3), 0 0 20px rgba(0,255,127,0.2); }
        50% { box-shadow: inset 0 0 40px rgba(0,255,127,0.5), 0 0 30px rgba(0,255,127,0.4); }
      }
      @keyframes buttonPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const styles = {
    container: {
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      imageRendering: "pixelated",
      background: "linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #4c1d95 100%)",
      padding: "30px",
      borderRadius: "15px",
      border: "4px solid #7c3aed",
      boxShadow: "0 0 40px rgba(124, 58, 237, 0.5), inset 0 0 20px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto"
    },
    title: {
      fontSize: "1.4rem",
      color: "#FFD700",
      textShadow: "0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347",
      marginBottom: "25px",
      letterSpacing: "2px",
      animation: "titleGlow 3s ease-in-out infinite"
    },
    controls: {
      marginBottom: "25px",
      padding: "15px",
      background: "rgba(124, 58, 237, 0.2)",
      borderRadius: "10px",
      border: "2px solid #7c3aed"
    },
    forceLabel: {
      fontSize: "0.9rem",
      color: "#e9d5ff",
      textShadow: "1px 1px 0px #4c1d95",
      marginBottom: "10px",
      display: "block"
    },
    slider: {
      width: "200px",
      height: "10px",
      background: "#4c1d95",
      borderRadius: "5px",
      outline: "none",
      border: "2px solid #7c3aed",
      cursor: "pointer",
      imageRendering: "pixelated"
    },
    arena: {
      position: "relative",
      width: "500px",
      height: "200px",
      margin: "0 auto 25px",
      background: `
        radial-gradient(circle at 30% 30%, rgba(0, 255, 127, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(50, 205, 50, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #228B22 0%, #32CD32 25%, #00FF7F 50%, #98FB98 75%, #F0FFF0 100%)
      `,
      border: "4px solid #00FF7F",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: `
        inset 0 0 30px rgba(0,255,127,0.3),
        0 0 20px rgba(0,255,127,0.2),
        0 8px 16px rgba(0,0,0,0.3)
      `,
      imageRendering: "pixelated",
      animation: "arenaGlow 4s ease-in-out infinite"
    },
    ball: {
      position: "absolute",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      background: `
        radial-gradient(circle at 30% 30%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #FF6347 100%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)
      `,
      border: "3px solid #FF4500",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translateX(${position}px) ${isMoving ? 'scale(1.2)' : 'scale(1)'}`,
      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      zIndex: 10,
      imageRendering: "pixelated",
      boxShadow: `
        0 8px 16px rgba(0,0,0,0.4),
        inset 0 4px 8px rgba(255,255,255,0.3),
        inset 0 -4px 8px rgba(0,0,0,0.3),
        ${ballGlow ? '0 0 30px rgba(255, 215, 0, 1)' : '0 0 15px rgba(255, 215, 0, 0.5)'}
      `,
      animation: isMoving ? "ballBounce 0.3s ease-out" : (ballGlow ? "ballGlow 2s ease-in-out infinite" : "none")
    },
    buttons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      flexWrap: "wrap"
    },
    button: {
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      fontSize: "0.8rem",
      padding: "15px 25px",
      border: "3px solid #7c3aed",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      color: "#ffffff",
      cursor: "pointer",
      textShadow: "1px 1px 0px #4c1d95",
      boxShadow: "0 6px 0 #4c1d95, 0 0 20px rgba(124, 58, 237, 0.4)",
      transition: "all 0.1s ease",
      imageRendering: "pixelated",
      letterSpacing: "1px"
    },
    leftButton: {
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      boxShadow: "0 6px 0 #991b1b, 0 0 20px rgba(239, 68, 68, 0.4)"
    },
    rightButton: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      boxShadow: "0 6px 0 #047857, 0 0 20px rgba(16, 185, 129, 0.4)"
    },
    resetButton: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      boxShadow: "0 6px 0 #92400e, 0 0 20px rgba(245, 158, 11, 0.4)"
    },
    particle: (particle) => ({
      position: "absolute",
      width: "6px",
      height: "6px",
      background: particle.color,
      borderRadius: "50%",
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      opacity: particle.life,
      pointerEvents: "none",
      zIndex: 20,
      boxShadow: `0 0 8px ${particle.color}`,
      imageRendering: "pixelated"
    })
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚽ PIXELATED BALL PUSH CHALLENGE</h2>

      {/* Force Control */}
      <div style={styles.controls}>
        <label style={styles.forceLabel}>
          ⚡ FORCE POWER: <strong style={{color: force > 10 ? '#FFD700' : '#e9d5ff'}}>{force}/20</strong>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          style={{
            ...styles.slider,
            background: force > 10 ? 
              `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force * 5}%, #4c1d95 100%)` : 
              `linear-gradient(to right, #ef4444 0%, #f87171 ${force * 5}%, #4c1d95 100%)`
          }}
        />
      </div>

      {/* Game Arena */}
      <div style={styles.arena}>
        <div style={styles.ball}></div>
        {particles.map((particle) => (
          <div key={particle.id} style={styles.particle(particle)} />
        ))}
      </div>

      {/* Control Buttons */}
      <div style={styles.buttons}>
        <button 
          style={{...styles.button, ...styles.leftButton}}
          onClick={pushLeft}
          onMouseEnter={(e) => {
            if (!isMoving) e.target.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            if (!isMoving) e.target.style.transform = "translateY(0)";
          }}
        >
          ⬅ PUSH LEFT
        </button>
        <button 
          style={{...styles.button, ...styles.rightButton}}
          onClick={pushRight}
          onMouseEnter={(e) => {
            if (!isMoving) e.target.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            if (!isMoving) e.target.style.transform = "translateY(0)";
          }}
        >
          PUSH RIGHT ➡
        </button>
        <button 
          style={{...styles.button, ...styles.resetButton}}
          onClick={reset}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
        >
          🔄 RESET
        </button>
      </div>
    </div>
  );
}