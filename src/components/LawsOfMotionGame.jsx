import React, { useState, useEffect } from "react";

export default function ForceEffectsGame() {
  return (
    <div style={{ 
      fontFamily: "'Press Start 2P', 'Courier New', monospace",
      padding: "20px",
      background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      borderRadius: "15px",
      border: "3px solid #4a90e2",
      boxShadow: "0 0 20px rgba(74, 144, 226, 0.3), inset 0 0 20px rgba(74, 144, 226, 0.1)",
      margin: "20px 0",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Pixel Grid Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `
          linear-gradient(90deg, rgba(74, 144, 226, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(74, 144, 226, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        zIndex: 0,
        opacity: 0.3
      }} />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 className="pixel-text" style={{ 
          textAlign: "center", 
          marginBottom: "30px",
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "1.2rem",
          letterSpacing: "2px",
          imageRendering: "pixelated",
          color: "#4a90e2",
          textShadow: "2px 2px 0px #1a1a2e, 0 0 10px rgba(74, 144, 226, 0.5)"
        }}>
          🎮 Effects of Force Demo
        </h1>

        {/* 1. Start/Stop Motion */}
        <StartStopDemo />

        {/* 2. Change Speed / Direction */}
        <div style={{ marginBottom: "40px" }}>
          <SpeedDirectionDemo />
        </div>

        {/* 3. Change Shape / Size */}
        <ShapeChangeDemo />
      </div>
    </div>
  );
}

// --------------- DEMO 1: START / STOP -----------------
// --------------- DEMO 1: START / STOP -----------------
function StartStopDemo() {
  const [pos, setPos] = useState(30);
  const [moving, setMoving] = useState(false);
  const [angle, setAngle] = useState(0); // rotation for rolling effect
  const [groundOffset, setGroundOffset] = useState(0); // ground scroll

  useEffect(() => {
    let frame;
    const animate = () => {
      setPos((p) => {
        if (moving) {
          setAngle((a) => a + 10); // spin ball
          setGroundOffset((g) => (g - 5) % 40); // scroll ground
          return (p + 3) % 340; // loop back after crossing box width
        }
        return p;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  const handleReset = () => {
    setMoving(false);
    setPos(30);
    setAngle(0);
    setGroundOffset(0);
  };

  return (
    <div style={{
      ...cardStyle,
      background: "linear-gradient(135deg, #2c3e50, #34495e)",
      border: "2px solid #3498db",
      boxShadow: "0 0 15px rgba(52, 152, 219, 0.3), inset 0 0 15px rgba(52, 152, 219, 0.1)",
      color: "#ecf0f1"
    }}>
      <h2 className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "1rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        color: "#3498db",
        textShadow: "1px 1px 0px #2c3e50"
      }}>1️⃣ Force Starts or Stops Motion</h2>
      <p className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        lineHeight: "1.4",
        color: "#bdc3c7",
        marginBottom: "20px"
      }}>Click push to roll the ball, stop to halt it, reset to start again.</p>

      <div
        style={{
          ...boxStyle,
          background: "linear-gradient(180deg, #87ceeb 0%, #87ceeb 60%, #27ae60 60%, #2ecc71 100%)",
          overflow: "hidden",
          border: "3px solid #34495e",
          borderRadius: "10px",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 0 10px rgba(52, 152, 219, 0.2)",
          imageRendering: "pixelated"
        }}
      >
        {/* Pixel Clouds */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "20px",
          width: "40px",
          height: "20px",
          background: "#ffffff",
          borderRadius: "20px",
          opacity: 0.8,
          boxShadow: "0 0 10px rgba(255,255,255,0.5)"
        }} />
        <div style={{
          position: "absolute",
          top: "15px",
          right: "30px",
          width: "30px",
          height: "15px",
          background: "#ffffff",
          borderRadius: "15px",
          opacity: 0.7
        }} />

        {/* Scrolling Ground with pixel pattern */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: `${groundOffset}px`,
            width: "200%",
            height: "40%",
            backgroundImage: `
              linear-gradient(to right, 
                #27ae60 0px, #27ae60 10px,
                #2ecc71 10px, #2ecc71 20px,
                #27ae60 20px, #27ae60 30px,
                #2ecc71 30px, #2ecc71 40px
              )
            `,
            backgroundSize: "40px 100%",
            imageRendering: "pixelated",
            borderTop: "2px solid #1e8449"
          }}
        />

        {/* Enhanced Ball */}
        <div
          style={{
            position: "absolute",
            left: `${pos}px`,
            top: "40px",
            width: "50px",
            height: "50px",
            background: "radial-gradient(circle at 30% 30%, #ff6b6b, #e74c3c, #c0392b)",
            borderRadius: "50%",
            transform: `rotate(${angle}deg)`,
            transition: moving ? "none" : "transform 0.3s ease",
            border: "2px solid #a93226",
            boxShadow: moving ? "0 5px 15px rgba(231, 76, 60, 0.4)" : "0 2px 8px rgba(0,0,0,0.3)",
            imageRendering: "pixelated"
          }}
        >
          {/* Ball highlight */}
          <div style={{
            position: "absolute",
            top: "8px",
            left: "12px",
            width: "12px",
            height: "12px",
            background: "#ffffff",
            borderRadius: "50%",
            opacity: 0.6
          }} />
        </div>

        {/* Motion trail effect */}
        {moving && (
          <div style={{
            position: "absolute",
            left: `${Math.max(0, pos - 20)}px`,
            top: "55px",
            width: "20px",
            height: "20px",
            background: "rgba(231, 76, 60, 0.3)",
            borderRadius: "50%",
            animation: "fadeOut 0.5s ease-out"
          }} />
        )}
      </div>

      <button onClick={() => setMoving(true)} className="pixel-text" style={{
        ...btnStyle,
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        background: moving ? "#27ae60" : "#3498db",
        border: "2px solid #2c3e50",
        boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(52, 152, 219, 0.3)",
        transform: "translateY(0)",
        transition: "all 0.1s ease"
      }}
      onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
      onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
      onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
      >
        🚀 Push (Start)
      </button>
      <button onClick={() => setMoving(false)} className="pixel-text" style={{
        ...btnStyle,
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        background: "#e74c3c",
        border: "2px solid #2c3e50",
        boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(231, 76, 60, 0.3)",
        transform: "translateY(0)",
        transition: "all 0.1s ease"
      }}
      onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
      onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
      onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
      >
        ⛔ Stop
      </button>
      <button onClick={handleReset} className="pixel-text" style={{
        ...btnStyle,
        background: "#f39c12",
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        border: "2px solid #2c3e50",
        boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(243, 156, 18, 0.3)",
        transform: "translateY(0)",
        transition: "all 0.1s ease"
      }}
      onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
      onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
      onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
      >
        🔄 Reset
      </button>
    </div>
  );
}


// --------------- DEMO 2: SPEED / DIRECTION -----------------
function SpeedDirectionDemo() {
  const [pos, setPos] = React.useState({ x: 100, y: 40 });
  const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
  const [rotation, setRotation] = React.useState(0);
  const [groundOffset, setGroundOffset] = React.useState(0);

  const boxStyle = {
    position: "relative",
    width: "320px",
    height: "150px",
    overflow: "hidden",
    border: "2px solid #333",
    margin: "20px auto",
    borderRadius: "10px",
    background: "linear-gradient(#87ceeb, #87ceeb 60%, green 60%)",
  };

  const btnStyle = {
    margin: "5px",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const cardStyle = {
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
  };

  React.useEffect(() => {
    let frame;
    const animate = () => {
      setPos((p) => {
        const newX = Math.max(0, Math.min(270, p.x + velocity.x));
        const newY = Math.max(0, Math.min(100, p.y + velocity.y));

        // Ball rotation based on speed
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        setRotation((r) => r + speed * 10);

        // Ground scrolling
        setGroundOffset((offset) => offset - velocity.x);

        return { x: newX, y: newY };
      });

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [velocity]);

  const handleKick = (dir) => {
    setVelocity((v) => ({ x: v.x + dir.x, y: v.y + dir.y }));
  };

  const handleReset = () => {
    setPos({ x: 100, y: 40 });
    setVelocity({ x: 0, y: 0 });
    setRotation(0);
    setGroundOffset(0);
  };

  return (
    <div style={{
      ...cardStyle,
      background: "linear-gradient(135deg, #2c3e50, #34495e)",
      border: "2px solid #e67e22",
      boxShadow: "0 0 15px rgba(230, 126, 34, 0.3), inset 0 0 15px rgba(230, 126, 34, 0.1)",
      color: "#ecf0f1"
    }}>
      <h2 className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "1rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        color: "#e67e22",
        textShadow: "1px 1px 0px #2c3e50"
      }}>⚽ Force Changes Speed and Direction</h2>
      <p className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        lineHeight: "1.4",
        color: "#bdc3c7",
        marginBottom: "20px"
      }}>Kick the ball using buttons, reset to restart.</p>

      <div style={{
        ...boxStyle,
        background: "linear-gradient(180deg, #3498db 0%, #3498db 60%, #27ae60 60%, #2ecc71 100%)",
        border: "3px solid #34495e",
        borderRadius: "10px",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 0 10px rgba(230, 126, 34, 0.2)",
        imageRendering: "pixelated"
      }}>
        {/* Enhanced Ground */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: `${groundOffset}px`,
            width: "1000px",
            height: "60px",
            backgroundImage: `
              linear-gradient(to right, 
                #27ae60 0px, #27ae60 15px,
                #2ecc71 15px, #2ecc71 30px,
                #27ae60 30px, #27ae60 45px,
                #2ecc71 45px, #2ecc71 60px
              )
            `,
            backgroundSize: "60px 100%",
            imageRendering: "pixelated",
            borderTop: "2px solid #1e8449"
          }}
        />

        {/* Enhanced Ball with trail */}
        <div
          style={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #f39c12, #e67e22, #d35400)",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.05s linear",
            border: "2px solid #a0522d",
            boxShadow: "0 3px 10px rgba(230, 126, 34, 0.4), inset 0 0 10px rgba(255,255,255,0.2)",
            imageRendering: "pixelated"
          }}
        >
          {/* Ball highlight */}
          <div style={{
            position: "absolute",
            top: "4px",
            left: "6px",
            width: "8px",
            height: "8px",
            background: "#ffffff",
            borderRadius: "50%",
            opacity: 0.7
          }} />
        </div>

        {/* Speed indicator */}
        {(Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0) && (
          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#e67e22",
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.6rem",
            textShadow: "1px 1px 0px #2c3e50"
          }}>
            Speed: {Math.round(Math.sqrt(velocity.x ** 2 + velocity.y ** 2))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={() => handleKick({ x: 2, y: 0 })} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: "#3498db",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(52, 152, 219, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          ➡️ Kick →
        </button>
        <button onClick={() => handleKick({ x: -2, y: 0 })} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: "#3498db",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(52, 152, 219, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          ⬅️ Kick ←
        </button>
        <button onClick={() => handleKick({ x: 0, y: -2 })} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: "#9b59b6",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(155, 89, 182, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          ⬆️ Kick ↑
        </button>
        <button onClick={() => handleKick({ x: 0, y: 2 })} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: "#9b59b6",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(155, 89, 182, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          ⬇️ Kick ↓
        </button>
        <button onClick={handleReset} className="pixel-text" style={{
          ...btnStyle,
          background: "#f39c12",
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(243, 156, 18, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}


// --------------- DEMO 3: SHAPE CHANGE -----------------
function ShapeChangeDemo() {
  const [stretched, setStretched] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{
      ...cardStyle,
      background: "linear-gradient(135deg, #2c3e50, #34495e)",
      border: "2px solid #9b59b6",
      boxShadow: "0 0 15px rgba(155, 89, 182, 0.3), inset 0 0 15px rgba(155, 89, 182, 0.1)",
      color: "#ecf0f1"
    }}>
      <h2 className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "1rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        color: "#9b59b6",
        textShadow: "1px 1px 0px #2c3e50"
      }}>🌀 Force Changes Shape or Size</h2>
      <p className="pixel-text" style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        imageRendering: "pixelated",
        lineHeight: "1.4",
        color: "#bdc3c7",
        marginBottom: "20px"
      }}>Stretch the spring or press the ball to see deformation.</p>

      {/* Enhanced Spring */}
      <div style={{ 
        marginBottom: "30px",
        padding: "20px",
        background: "linear-gradient(135deg, #34495e, #2c3e50)",
        borderRadius: "10px",
        border: "2px solid #9b59b6",
        boxShadow: "inset 0 0 15px rgba(155, 89, 182, 0.2)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80px",
          marginBottom: "15px",
          padding: "15px"
        }}>
          {/* Coiled Spring visualization */}
          <div style={{
            width: stretched ? "200px" : "150px",
            height: "40px",
            position: "relative",
            transition: "all 0.3s ease"
          }}>
            {/* Create multiple coils */}
            {Array.from({ length: stretched ? 16 : 12 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(i / (stretched ? 15 : 11)) * 100}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: stretched ? "12px" : "12px",
                  height: "35px",
                  border: "3px solid #c0c0c0",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e8e8e8, #c0c0c0, #a0a0a0)",
                  boxShadow: `
                    inset 2px 2px 4px rgba(255,255,255,0.3),
                    inset -2px -2px 4px rgba(0,0,0,0.3),
                    0 2px 4px rgba(0,0,0,0.2)
                  `,
                  borderLeft: "3px solid #f0f0f0",
                  borderTop: "3px solid #f0f0f0",
                  borderRight: "3px solid #909090",
                  borderBottom: "3px solid #909090"
                }}
              />
            ))}
            {/* Spring ends */}
            <div style={{
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "8px",
              height: "30px",
              background: "linear-gradient(135deg, #d0d0d0, #a0a0a0)",
              borderRadius: "4px 0 0 4px",
              border: "2px solid #909090"
            }} />
            <div style={{
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "8px",
              height: "30px",
              background: "linear-gradient(135deg, #d0d0d0, #a0a0a0)",
              borderRadius: "0 4px 4px 0",
              border: "2px solid #909090"
            }} />
          </div>
        </div>
        <button onClick={() => setStretched((s) => !s)} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: stretched ? "#27ae60" : "#e74c3c",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(231, 76, 60, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          {stretched ? "🔓 Release Spring" : "🔧 Stretch Spring"}
        </button>
      </div>

      {/* Enhanced Ball deformation */}
      <div style={{
        padding: "20px",
        background: "linear-gradient(135deg, #34495e, #2c3e50)",
        borderRadius: "10px",
        border: "2px solid #9b59b6",
        boxShadow: "inset 0 0 15px rgba(155, 89, 182, 0.2)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          marginBottom: "15px"
        }}>
          <div
            style={{
              width: pressed ? "100px" : "80px",
              height: pressed ? "50px" : "80px",
              background: "radial-gradient(circle at 30% 30%, #2ecc71, #27ae60, #1e8449)",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              border: "3px solid #1e8449",
              boxShadow: pressed ? "0 2px 8px rgba(46, 204, 113, 0.4)" : "0 5px 15px rgba(46, 204, 113, 0.4)",
              imageRendering: "pixelated",
              position: "relative"
            }}
          >
            {/* Ball highlight */}
            <div style={{
              position: "absolute",
              top: pressed ? "8px" : "15px",
              left: pressed ? "20px" : "18px",
              width: pressed ? "20px" : "15px",
              height: pressed ? "10px" : "15px",
              background: "#ffffff",
              borderRadius: "50%",
              opacity: 0.6,
              transition: "all 0.3s ease"
            }} />
          </div>
        </div>
        <button onClick={() => setPressed((p) => !p)} className="pixel-text" style={{
          ...btnStyle,
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          imageRendering: "pixelated",
          background: pressed ? "#27ae60" : "#2ecc71",
          border: "2px solid #2c3e50",
          boxShadow: "0 4px 0 #2c3e50, 0 0 10px rgba(46, 204, 113, 0.3)",
          transform: "translateY(0)",
          transition: "all 0.1s ease"
        }}
        onMouseDown={(e) => e.target.style.transform = "translateY(2px)"}
        onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          {pressed ? "🔓 Release Ball" : "👊 Press Ball"}
        </button>
      </div>
    </div>
  );
}

// --------------- STYLES -----------------
const cardStyle = {
  border: "2px solid #ccc",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "24px",
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const boxStyle = {
  position: "relative",
  height: "140px",
  border: "2px solid black",
  margin: "20px auto",
  width: "340px",
  borderRadius: "8px",
  background: "#fafafa",
  overflow: "hidden",
};

const btnStyle = {
  margin: "6px",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#0077ff",
  color: "white",
  fontWeight: "bold",
};