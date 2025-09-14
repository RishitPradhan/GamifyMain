import React, { useState, useEffect, useRef } from "react";

// Add Google Fonts for pixelated text
if (!document.querySelector('link[href*="Press+Start+2P"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function PushBallNewton() {
  const stageRef = useRef(null);
  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);

  const [force1, setForce1] = useState(20);
  const [force2, setForce2] = useState(20);
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(8);
  const [pos1, setPos1] = useState(100);
  const [pos2, setPos2] = useState(100);
  const [vel1, setVel1] = useState(0);
  const [vel2, setVel2] = useState(0);
  const [infoText, setInfoText] = useState("");

  const stageWidth = stageRef.current?.clientWidth || 800;

  useEffect(() => {
    setPos1(100);
    setPos2(100);
    setVel1(0);
    setVel2(0);
  }, []);

  useEffect(() => {
    let animationFrame;

    const update = () => {
      const a1 = force1 / mass1;
      const a2 = force2 / mass2;

      let newVel1 = vel1 + a1 * 0.02;
      let newVel2 = vel2 + a2 * 0.02;

      let newPos1 = pos1 + newVel1;
      let newPos2 = pos2 + newVel2;

      const maxPos = stageWidth - 40;

      if (newPos1 > maxPos) {
        newPos1 = maxPos;
        newVel1 = 0;
      }
      if (newPos2 > maxPos) {
        newPos2 = maxPos;
        newVel2 = 0;
      }

      setPos1(newPos1);
      setPos2(newPos2);
      setVel1(newVel1);
      setVel2(newVel2);

      setInfoText(
        `Ball1 Accel: ${a1.toFixed(2)} m/s² | Ball2 Accel: ${a2.toFixed(2)} m/s²`
      );

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [force1, force2, mass1, mass2, pos1, pos2, vel1, vel2, stageWidth]);

  const handleReset = () => {
    setPos1(100);
    setPos2(100);
    setVel1(0);
    setVel2(0);
    setForce1(20);
    setForce2(20);
    setMass1(5);
    setMass2(8);
  };

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes titleGlow {
        0%, 100% { text-shadow: 0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347; }
        50% { text-shadow: 0 0 25px rgba(255, 215, 0, 1), 2px 2px 0px #FF6347, 0 0 35px rgba(255, 215, 0, 0.5); }
      }
      @keyframes stageGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3), inset 0 0 30px rgba(0,0,0,0.3); }
        50% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.5), inset 0 0 30px rgba(0,0,0,0.3); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        imageRendering: "pixelated",
        background: "linear-gradient(135deg, #0f0a1f 0%, #1b1233 50%, #2d1b4e 100%)",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "auto",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <div style={{ width: "100%" }}>
        <h2 style={{
          fontSize: "1.4rem",
          color: "#FFD700",
          textShadow: "0 0 15px rgba(255, 215, 0, 0.8), 2px 2px 0px #FF6347",
          marginBottom: "25px",
          letterSpacing: "2px",
          animation: "titleGlow 3s ease-in-out infinite"
        }}>⚡ NEWTON'S 2ND LAW SIMULATOR</h2>
        {/* Pixelated Controls */}
        <div
          style={{
            background: "rgba(124, 58, 237, 0.2)",
            padding: "20px",
            borderRadius: "12px",
            border: "2px solid #7c3aed",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{textAlign: "center"}}>
            <label style={{
              fontSize: "0.8rem",
              color: "#e9d5ff",
              textShadow: "1px 1px 0px #4c1d95",
              display: "block",
              marginBottom: "8px"
            }}>
              🏃‍♂️ P1 FORCE: <b style={{color: force1 > 25 ? '#FFD700' : '#e9d5ff'}}>{force1}</b> N
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={force1}
              onChange={(e) => setForce1(Number(e.target.value))}
              style={{
                width: "120px",
                height: "8px",
                background: force1 > 25 ? 
                  `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force1 * 2}%, #4c1d95 100%)` : 
                  `linear-gradient(to right, #ef4444 0%, #f87171 ${force1 * 2}%, #4c1d95 100%)`,
                borderRadius: "4px",
                outline: "none",
                border: "2px solid #7c3aed",
                cursor: "pointer",
                imageRendering: "pixelated"
              }}
            />
            <br />
            <label style={{
              fontSize: "0.8rem",
              color: "#e9d5ff",
              textShadow: "1px 1px 0px #4c1d95",
              display: "block",
              marginTop: "10px",
              marginBottom: "8px"
            }}>
              ⚖️ P1 MASS: <b style={{color: mass1 > 10 ? '#FFD700' : '#e9d5ff'}}>{mass1}</b> kg
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={mass1}
              onChange={(e) => setMass1(Number(e.target.value))}
              style={{
                width: "120px",
                height: "8px",
                background: `linear-gradient(to right, #10b981 0%, #34d399 ${mass1 * 5}%, #047857 100%)`,
                borderRadius: "4px",
                outline: "none",
                border: "2px solid #10b981",
                cursor: "pointer",
                imageRendering: "pixelated"
              }}
            />
          </div>

          <div style={{textAlign: "center"}}>
            <label style={{
              fontSize: "0.8rem",
              color: "#e9d5ff",
              textShadow: "1px 1px 0px #4c1d95",
              display: "block",
              marginBottom: "8px"
            }}>
              🏃‍♀️ P2 FORCE: <b style={{color: force2 > 25 ? '#FFD700' : '#e9d5ff'}}>{force2}</b> N
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={force2}
              onChange={(e) => setForce2(Number(e.target.value))}
              style={{
                width: "120px",
                height: "8px",
                background: force2 > 25 ? 
                  `linear-gradient(to right, #7c3aed 0%, #8b5cf6 ${force2 * 2}%, #4c1d95 100%)` : 
                  `linear-gradient(to right, #ef4444 0%, #f87171 ${force2 * 2}%, #4c1d95 100%)`,
                borderRadius: "4px",
                outline: "none",
                border: "2px solid #7c3aed",
                cursor: "pointer",
                imageRendering: "pixelated"
              }}
            />
            <br />
            <label style={{
              fontSize: "0.8rem",
              color: "#e9d5ff",
              textShadow: "1px 1px 0px #4c1d95",
              display: "block",
              marginTop: "10px",
              marginBottom: "8px"
            }}>
              ⚖️ P2 MASS: <b style={{color: mass2 > 10 ? '#FFD700' : '#e9d5ff'}}>{mass2}</b> kg
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={mass2}
              onChange={(e) => setMass2(Number(e.target.value))}
              style={{
                width: "120px",
                height: "8px",
                background: `linear-gradient(to right, #10b981 0%, #34d399 ${mass2 * 5}%, #047857 100%)`,
                borderRadius: "4px",
                outline: "none",
                border: "2px solid #10b981",
                cursor: "pointer",
                imageRendering: "pixelated"
              }}
            />
          </div>

          <button
            onClick={handleReset}
            style={{
              fontFamily: "'Press Start 2P', 'Courier New', monospace",
              fontSize: "0.7rem",
              padding: "12px 20px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff",
              border: "2px solid #f59e0b",
              cursor: "pointer",
              textShadow: "1px 1px 0px #92400e",
              boxShadow: "0 4px 0 #92400e, 0 0 15px rgba(245, 158, 11, 0.3)",
              transition: "all 0.1s ease",
              imageRendering: "pixelated",
              alignSelf: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            🔄 RESET
          </button>
        </div>

        {/* Pixelated Physics Arena */}
        <div
          ref={stageRef}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #4c1d95 100%)
            `,
            borderRadius: "15px",
            position: "relative",
            overflow: "hidden",
            minHeight: "60vh",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            border: "4px solid #7c3aed",
            boxShadow: `
              inset 0 0 30px rgba(0,0,0,0.5),
              0 0 20px rgba(124, 58, 237, 0.3),
              0 8px 16px rgba(0,0,0,0.4)
            `,
            imageRendering: "pixelated",
            animation: "stageGlow 4s ease-in-out infinite"
          }}
        >
          {/* Pixelated Physics Info */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.7rem",
              color: "#e9d5ff",
              textShadow: "1px 1px 0px #4c1d95, 0 0 10px rgba(233, 213, 255, 0.5)",
              whiteSpace: "nowrap",
              textAlign: "center",
              background: "rgba(124, 58, 237, 0.3)",
              padding: "8px 15px",
              borderRadius: "8px",
              border: "1px solid #7c3aed"
            }}
          >
            ⚡ {infoText}
          </div>

          {/* Pixelated Players */}
          <div style={{ position: "absolute", top: "50px", left: "30px" }}>
            <span
              style={{
                fontSize: "50px",
                display: "inline-block",
                transform: "scaleX(-1)",
                imageRendering: "pixelated",
                filter: `
                  ${force1 > 25 ? 'drop-shadow(0 0 15px #FFD700)' : 'none'}
                  contrast(1.3) saturate(1.4)
                `,
                textShadow: "2px 2px 0px #4c1d95"
              }}
            >
              🏃‍♂️
            </span>
            <div style={{ 
              fontSize: "0.7rem", 
              color: "#e9d5ff", 
              textShadow: "1px 1px 0px #4c1d95",
              textAlign: "center",
              marginTop: "5px"
            }}>P1</div>
          </div>

          <div style={{ position: "absolute", bottom: "50px", left: "30px" }}>
            <span
              style={{
                fontSize: "50px",
                display: "inline-block",
                transform: "scaleX(-1)",
                imageRendering: "pixelated",
                filter: `
                  ${force2 > 25 ? 'drop-shadow(0 0 15px #FFD700)' : 'none'}
                  contrast(1.3) saturate(1.4)
                `,
                textShadow: "2px 2px 0px #4c1d95"
              }}
            >
              🏃‍♀️
            </span>
            <div style={{ 
              fontSize: "0.7rem", 
              color: "#e9d5ff", 
              textShadow: "1px 1px 0px #4c1d95",
              textAlign: "center",
              marginTop: "5px"
            }}>P2</div>
          </div>

          {/* Pixelated Physics Balls */}
          <div
            ref={ball1Ref}
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              background: `
                radial-gradient(circle at 30% 30%, #FF6347 0%, #FF4500 30%, #DC143C 60%, #B22222 100%),
                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)
              `,
              border: "3px solid #8B0000",
              top: "70px",
              left: `${pos1}px`,
              transition: "all 0.1s ease",
              imageRendering: "pixelated",
              boxShadow: `
                0 4px 8px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 0 15px rgba(255, 99, 71, 0.5)
              `
            }}
          >
            ⚽
          </div>
          <div
            ref={ball2Ref}
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              background: `
                radial-gradient(circle at 30% 30%, #32CD32 0%, #228B22 30%, #006400 60%, #004000 100%),
                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)
              `,
              border: "3px solid #006400",
              bottom: "70px",
              left: `${pos2}px`,
              transition: "all 0.1s ease",
              imageRendering: "pixelated",
              boxShadow: `
                0 4px 8px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 0 15px rgba(50, 205, 50, 0.5)
              `
            }}
          >
            ⚽
          </div>
        </div>

        {/* Pixelated Physics Explanation */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "rgba(124, 58, 237, 0.2)",
            border: "2px solid #7c3aed",
            borderRadius: "12px",
            fontSize: "0.8rem",
            lineHeight: "1.6",
            color: "#e9d5ff",
            textShadow: "1px 1px 0px #4c1d95"
          }}
        >
          <div style={{
            fontSize: "1rem",
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            ⚡ NEWTON'S SECOND LAW OF MOTION
          </div>
          The acceleration (<i>a</i>) of an object is directly proportional to the
          net force (<i>F</i>) applied and inversely proportional to its mass (<i>m</i>):
          <br /><br />
          <div style={{
            background: "rgba(0,0,0,0.3)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#FFD700",
            border: "1px solid #7c3aed",
            marginBottom: "15px"
          }}>
            F = m × a → a = F / m
          </div>
          🔹 If you increase the <b style={{color: '#FFD700'}}>force</b>, acceleration increases.
          <br />
          🔹 If you increase the <b style={{color: '#FFD700'}}>mass</b>, acceleration decreases.
          <br /><br />
          <div style={{textAlign: "center", color: "#c4b5fd"}}>
            👉 Try changing the sliders above to see how the balls move differently!
          </div>
        </div>
      </div>
    </div>
  );
}