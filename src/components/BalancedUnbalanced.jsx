import React, { useState, useEffect, useRef } from "react";

export default function BalancedUnbalanced() {
  const stageRef = useRef(null);
  const blockRef = useRef(null);
  const [fLeft, setFLeft] = useState(0);
  const [fRight, setFRight] = useState(0);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    // Initialize block in center
    if (stageRef.current && blockRef.current) {
      const centerPos =
        stageRef.current.clientWidth / 2 -
        blockRef.current.offsetWidth / 2;
      setPos(centerPos);
    }
  }, []);

  useEffect(() => {
    let animationFrame;
    const updateMovement = () => {
      if (!stageRef.current || !blockRef.current) return;
      let newPos = pos;
      if (fLeft === fRight) {
        // Block is still
      } else if (fLeft > fRight) {
        newPos -= 1;
        if (newPos < 0) newPos = 0;
        // Block moves left
      } else {
        newPos += 1;
        const maxPos =
          stageRef.current.clientWidth - blockRef.current.offsetWidth;
        if (newPos > maxPos) newPos = maxPos;
        // Block moves right
      }
      setPos(newPos);
      animationFrame = requestAnimationFrame(updateMovement);
    };
    animationFrame = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationFrame);
  }, [pos, fLeft, fRight]);

  const handleReset = () => {
    if (stageRef.current && blockRef.current) {
      const centerPos =
        stageRef.current.clientWidth / 2 -
        blockRef.current.offsetWidth / 2;
      setPos(centerPos);
      setFLeft(0);
      setFRight(0);
      // Reset to center
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "transparent",
        imageRendering: "pixelated",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* Pixelated game title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "1rem",
            color: "#2c3e50",
            textShadow: "2px 2px 0px #ecf0f1",
            letterSpacing: "2px",
            imageRendering: "pixelated",
            padding: "8px 16px",
            border: "3px solid #34495e",
            borderRadius: "8px",
            backgroundColor: "#ecf0f1",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          TUG OF WAR GAME
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "30px",
            maxWidth: "950px",
            width: "100%",
            padding: "20px",
          }}
        >

          <div
          ref={stageRef}
          style={{
            background: "linear-gradient(135deg, #2c3e50, #34495e)",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(52, 152, 219, 0.3), inset 0 0 15px rgba(52, 152, 219, 0.1)",
            border: "3px solid #3498db",
            position: "relative",
            overflow: "hidden",
            minHeight: "320px",
            paddingTop: "50px",
            imageRendering: "pixelated",
          }}
        >
          <div
            className="pixel-text"
            style={{
              position: "absolute",
              top: "15px",
              left: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "25px",
              left: "70px",
              width: "40px",
              height: "15px",
              background: "#FFFFFF",
              borderRadius: "15px",
              opacity: 0.8,
            }}
          />
          
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "80px",
              width: "80px",
              height: "25px",
              background: "#FFFFFF",
              borderRadius: "25px",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35px",
              right: "70px",
              width: "40px",
              height: "18px",
              background: "#FFFFFF",
              borderRadius: "18px",
              opacity: 0.7,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "200px",
              width: "50px",
              height: "18px",
              background: "#FFFFFF",
              borderRadius: "18px",
              opacity: 0.6,
            }}
          />

          {/* Green grass ground */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, #7CB342 0%, #689F38 50%, #558B2F 100%)",
              imageRendering: "pixelated",
            }}
          />

          {/* Grass texture */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: 0,
              right: 0,
              height: "20px",
              background: "repeating-linear-gradient(90deg, #8BC34A 0px, #8BC34A 3px, #7CB342 3px, #7CB342 6px)",
              imageRendering: "pixelated",
            }}
          />

          {/* Rope texture details */}
          <div
            style={{
              position: "absolute",
              bottom: "110px",
              left: "5%",
              right: "5%",
              height: "4px",
              background: "repeating-linear-gradient(90deg, #D2691E 0px, #D2691E 4px, transparent 4px, transparent 8px)",
              zIndex: 3,
              imageRendering: "pixelated",
            }}
          />

          {/* Detailed pixel warrior - left (green team) */}
          <div
            style={{
              width: "60px",
              height: "112px",
              position: "absolute",
              bottom: "80px",
              left: fLeft > fRight ? "10px" : "15px",
              zIndex: 3,
              transition: "left 0.2s ease",
              transform: fLeft > 0 ? "translateX(-4px)" : "translateX(0)",
              imageRendering: "pixelated",
            }}
          >
            {/* Hair - blonde */}
            <div style={{ position: "absolute", top: "0px", left: "8px", width: "40px", height: "4px", background: "#ffcc33" }} />
            <div style={{ position: "absolute", top: "4px", left: "12px", width: "32px", height: "4px", background: "#ffcc33" }} />
            
            {/* Headband - red */}
            <div style={{ position: "absolute", top: "8px", left: "8px", width: "40px", height: "8px", background: "#c43131" }} />
            <div style={{ position: "absolute", top: "12px", left: "12px", width: "32px", height: "4px", background: "#c43131" }} />
            
            {/* Head - skin tone with shadow */}
            <div style={{ position: "absolute", top: "16px", left: "8px", width: "40px", height: "32px", background: "#f1c08a" }} />
            <div style={{ position: "absolute", top: "32px", left: "24px", width: "24px", height: "16px", background: "#d8a971" }} />
            
            {/* Eyes */}
            <div style={{ position: "absolute", top: "20px", left: "20px", width: "4px", height: "4px", background: "#2a2a2a" }} />
            <div style={{ position: "absolute", top: "20px", left: "32px", width: "4px", height: "4px", background: "#2a2a2a" }} />
            
            {/* Cigar */}
            <div style={{ position: "absolute", top: "28px", left: "48px", width: "8px", height: "4px", background: "#5a3b2a" }} />
            <div style={{ position: "absolute", top: "28px", left: "56px", width: "4px", height: "4px", background: "#ff6b3b" }} />
            
            {/* Neck shadow */}
            <div style={{ position: "absolute", top: "40px", left: "24px", width: "8px", height: "8px", background: "#d8a971" }} />
            
            {/* Shirt - light gray with shadow */}
            <div style={{ position: "absolute", top: "44px", left: "4px", width: "48px", height: "32px", background: "#dddddd" }} />
            <div style={{ position: "absolute", top: "48px", left: "4px", width: "4px", height: "28px", background: "#bdbdbd" }} />
            <div style={{ position: "absolute", top: "48px", left: "48px", width: "4px", height: "28px", background: "#bdbdbd" }} />
            
            {/* Ammo belt */}
            <div style={{ position: "absolute", top: "48px", left: "8px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "52px", left: "12px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "56px", left: "16px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "60px", left: "20px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "64px", left: "24px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "68px", left: "28px", width: "8px", height: "4px", background: "#f4d03f" }} />
            
            {/* Strap */}
            <div style={{ position: "absolute", top: "44px", left: "28px", width: "4px", height: "32px", background: "#5b4636" }} />
            
            {/* Left arm reaching for rope */}
            <div style={{ position: "absolute", top: "56px", left: fLeft > 0 ? "-12px" : "-8px", width: "20px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "64px", left: fLeft > 0 ? "-16px" : "-12px", width: "16px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            {/* Left hand gripping rope */}
            <div style={{ position: "absolute", top: "72px", left: fLeft > 0 ? "-20px" : "-16px", width: "8px", height: "12px", background: "#2f2f38", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "76px", left: fLeft > 0 ? "-18px" : "-14px", width: "4px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            
            {/* Right arm reaching for rope */}
            <div style={{ position: "absolute", top: "56px", left: "48px", width: "20px", height: "8px", background: "#f1c08a" }} />
            <div style={{ position: "absolute", top: "64px", left: "52px", width: "16px", height: "8px", background: "#f1c08a" }} />
            {/* Right hand gripping rope */}
            <div style={{ position: "absolute", top: "72px", left: "56px", width: "8px", height: "12px", background: "#2f2f38" }} />
            <div style={{ position: "absolute", top: "76px", left: "58px", width: "4px", height: "8px", background: "#f1c08a" }} />
            
            {/* Pants - green theme */}
            <div style={{ position: "absolute", top: "76px", left: "0px", width: "28px", height: "24px", background: "#4a7c59" }} />
            <div style={{ position: "absolute", top: "76px", left: "0px", width: "4px", height: "24px", background: "#3d5e47" }} />
            <div style={{ position: "absolute", top: "76px", left: "28px", width: "4px", height: "24px", background: "#3d5e47" }} />
            <div style={{ position: "absolute", top: "76px", left: "32px", width: "28px", height: "24px", background: "#4a7c59" }} />
            <div style={{ position: "absolute", top: "76px", left: "56px", width: "4px", height: "24px", background: "#3d5e47" }} />
            
            {/* Boots */}
            <div style={{ position: "absolute", top: "100px", left: fLeft > 0 ? "-4px" : "0px", width: "28px", height: "12px", background: "#2b2e4a", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "100px", left: fLeft > 0 ? "-4px" : "0px", width: "4px", height: "12px", background: "#242741", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "100px", left: "32px", width: "28px", height: "12px", background: "#2b2e4a" }} />
            <div style={{ position: "absolute", top: "100px", left: "56px", width: "4px", height: "12px", background: "#242741" }} />
          </div>

          {/* Detailed pixel warrior - right (red team) */}
          <div
            style={{
              width: "60px",
              height: "112px",
              position: "absolute",
              bottom: "80px",
              right: fRight > fLeft ? "10px" : "15px",
              zIndex: 3,
              transition: "right 0.2s ease",
              transform: fRight > 0 ? "translateX(4px) scaleX(-1)" : "scaleX(-1)",
              imageRendering: "pixelated",
            }}
          >
            {/* Hair - blonde */}
            <div style={{ position: "absolute", top: "0px", left: "8px", width: "40px", height: "4px", background: "#ffcc33" }} />
            <div style={{ position: "absolute", top: "4px", left: "12px", width: "32px", height: "4px", background: "#ffcc33" }} />
            
            {/* Headband - red */}
            <div style={{ position: "absolute", top: "8px", left: "8px", width: "40px", height: "8px", background: "#c43131" }} />
            <div style={{ position: "absolute", top: "12px", left: "12px", width: "32px", height: "4px", background: "#c43131" }} />
            
            {/* Head - skin tone with shadow */}
            <div style={{ position: "absolute", top: "16px", left: "8px", width: "40px", height: "32px", background: "#f1c08a" }} />
            <div style={{ position: "absolute", top: "32px", left: "24px", width: "24px", height: "16px", background: "#d8a971" }} />
            
            {/* Eyes */}
            <div style={{ position: "absolute", top: "20px", left: "20px", width: "4px", height: "4px", background: "#2a2a2a" }} />
            <div style={{ position: "absolute", top: "20px", left: "32px", width: "4px", height: "4px", background: "#2a2a2a" }} />
            
            {/* Cigar */}
            <div style={{ position: "absolute", top: "28px", left: "48px", width: "8px", height: "4px", background: "#5a3b2a" }} />
            <div style={{ position: "absolute", top: "28px", left: "56px", width: "4px", height: "4px", background: "#ff6b3b" }} />
            
            {/* Neck shadow */}
            <div style={{ position: "absolute", top: "40px", left: "24px", width: "8px", height: "8px", background: "#d8a971" }} />
            
            {/* Shirt - light gray with shadow */}
            <div style={{ position: "absolute", top: "44px", left: "4px", width: "48px", height: "32px", background: "#dddddd" }} />
            <div style={{ position: "absolute", top: "48px", left: "4px", width: "4px", height: "28px", background: "#bdbdbd" }} />
            <div style={{ position: "absolute", top: "48px", left: "48px", width: "4px", height: "28px", background: "#bdbdbd" }} />
            
            {/* Ammo belt */}
            <div style={{ position: "absolute", top: "48px", left: "8px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "52px", left: "12px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "56px", left: "16px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "60px", left: "20px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "64px", left: "24px", width: "8px", height: "4px", background: "#f4d03f" }} />
            <div style={{ position: "absolute", top: "68px", left: "28px", width: "8px", height: "4px", background: "#f4d03f" }} />
            
            {/* Strap */}
            <div style={{ position: "absolute", top: "44px", left: "28px", width: "4px", height: "32px", background: "#5b4636" }} />
            
            {/* Left arm reaching for rope */}
            <div style={{ position: "absolute", top: "56px", left: fRight > 0 ? "-12px" : "-8px", width: "20px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "64px", left: fRight > 0 ? "-16px" : "-12px", width: "16px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            {/* Left hand gripping rope */}
            <div style={{ position: "absolute", top: "72px", left: fRight > 0 ? "-20px" : "-16px", width: "8px", height: "12px", background: "#2f2f38", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "76px", left: fRight > 0 ? "-18px" : "-14px", width: "4px", height: "8px", background: "#f1c08a", transition: "left 0.1s ease" }} />
            
            {/* Right arm reaching for rope */}
            <div style={{ position: "absolute", top: "56px", left: "48px", width: "20px", height: "8px", background: "#f1c08a" }} />
            <div style={{ position: "absolute", top: "64px", left: "52px", width: "16px", height: "8px", background: "#f1c08a" }} />
            {/* Right hand gripping rope */}
            <div style={{ position: "absolute", top: "72px", left: "56px", width: "8px", height: "12px", background: "#2f2f38" }} />
            <div style={{ position: "absolute", top: "76px", left: "58px", width: "4px", height: "8px", background: "#f1c08a" }} />
            
            {/* Pants - red theme */}
            <div style={{ position: "absolute", top: "76px", left: "0px", width: "28px", height: "24px", background: "#8b2635" }} />
            <div style={{ position: "absolute", top: "76px", left: "0px", width: "4px", height: "24px", background: "#6d1e2a" }} />
            <div style={{ position: "absolute", top: "76px", left: "28px", width: "4px", height: "24px", background: "#6d1e2a" }} />
            <div style={{ position: "absolute", top: "76px", left: "32px", width: "28px", height: "24px", background: "#8b2635" }} />
            <div style={{ position: "absolute", top: "76px", left: "56px", width: "4px", height: "24px", background: "#6d1e2a" }} />
            
            {/* Boots */}
            <div style={{ position: "absolute", top: "100px", left: fRight > 0 ? "-4px" : "0px", width: "28px", height: "12px", background: "#2b2e4a", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "100px", left: fRight > 0 ? "-4px" : "0px", width: "4px", height: "12px", background: "#242741", transition: "left 0.1s ease" }} />
            <div style={{ position: "absolute", top: "100px", left: "32px", width: "28px", height: "12px", background: "#2b2e4a" }} />
            <div style={{ position: "absolute", top: "100px", left: "56px", width: "4px", height: "12px", background: "#242741" }} />
          </div>

          {/* Realistic wooden crate */}
          <div
            ref={blockRef}
            style={{
              width: "80px",
              height: "55px",
              position: "absolute",
              bottom: "80px",
              zIndex: 2,
              left: pos + "px",
              transition: "transform 0.1s ease",
              transform: fLeft !== fRight ? "scale(1.05)" : "scale(1)",
              imageRendering: "pixelated",
            }}
          >
            {/* Main crate body */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #D2691E 0%, #A0522D 50%, #8B4513 100%)",
                position: "relative",
                border: "2px solid #654321",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
              }}
            >
              {/* Wood grain texture */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(139,69,19,0.3) 8px, rgba(139,69,19,0.3) 10px)",
                  borderRadius: "2px",
                }}
              />
              
              {/* Horizontal wood planks */}
              <div style={{ position: "absolute", top: "15px", left: "4px", right: "4px", height: "1px", background: "#654321" }} />
              <div style={{ position: "absolute", top: "30px", left: "4px", right: "4px", height: "1px", background: "#654321" }} />
              <div style={{ position: "absolute", top: "45px", left: "4px", right: "4px", height: "1px", background: "#654321" }} />
              
              {/* Vertical reinforcement */}
              <div style={{ position: "absolute", top: "8px", bottom: "8px", left: "20px", width: "2px", background: "#654321" }} />
              <div style={{ position: "absolute", top: "8px", bottom: "8px", right: "20px", width: "2px", background: "#654321" }} />
              
              {/* Metal corner brackets */}
              <div style={{ position: "absolute", top: "4px", left: "4px", width: "8px", height: "8px", background: "#708090", border: "1px solid #2F4F4F" }} />
              <div style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", background: "#708090", border: "1px solid #2F4F4F" }} />
              <div style={{ position: "absolute", bottom: "4px", left: "4px", width: "8px", height: "8px", background: "#708090", border: "1px solid #2F4F4F" }} />
              <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "8px", height: "8px", background: "#708090", border: "1px solid #2F4F4F" }} />
              
              {/* Center label */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(255,255,255,0.9)",
                  padding: "2px 6px",
                  borderRadius: "2px",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "0.5rem",
                  color: "#2c3e50",
                  border: "1px solid #bdc3c7",
                  letterSpacing: "0.5px",
                }}
              >
                CARGO
              </div>
              
            </div>
          </div>
        </div>

        <aside
          style={{
            background: "linear-gradient(135deg, #34495e, #2c3e50)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(39, 174, 96, 0.3), inset 0 0 15px rgba(39, 174, 96, 0.1)",
            border: "3px solid #27ae60",
            imageRendering: "pixelated",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              className="pixel-text"
              style={{
                display: "block",
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                fontSize: "0.7rem",
                letterSpacing: "1px",
                color: "#ffffff",
                textShadow: "1px 1px 0px #2c3e50",
                marginBottom: "8px",
                imageRendering: "pixelated",
              }}
            >
              ⬅ Left Force: <span style={{ color: "#e74c3c" }}>{fLeft} N</span>
            </label>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={fLeft}
              onChange={(e) => setFLeft(Number(e.target.value))}
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              className="pixel-text"
              style={{
                display: "block",
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                fontSize: "0.7rem",
                letterSpacing: "1px",
                color: "#ffffff",
                textShadow: "1px 1px 0px #2c3e50",
                marginBottom: "8px",
                imageRendering: "pixelated",
              }}
            >
              ➡ Right Force: <span style={{ color: "#e74c3c" }}>{fRight} N</span>
            </label>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={fRight}
              onChange={(e) => setFRight(Number(e.target.value))}
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            onClick={handleReset}
            className="pixel-text"
            style={{
              width: "100%",
              padding: "12px",
              fontFamily: "'Press Start 2P', 'Courier New', monospace",
              fontSize: "0.8rem",
              letterSpacing: "1px",
              color: "#ffffff",
              textShadow: "1px 1px 0px #2c3e50",
              background: "linear-gradient(135deg, #f39c12, #e67e22)",
              border: "3px solid #2c3e50",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 0 #2c3e50, 0 0 15px rgba(243, 156, 18, 0.3)",
              transition: "all 0.1s ease",
              transform: "translateY(0)",
              imageRendering: "pixelated",
            }}
            onMouseDown={(e) => (e.target.style.transform = "translateY(2px)")}
            onMouseUp={(e) => (e.target.style.transform = "translateY(0)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            🔄 Reset Game
          </button>
        </aside>
        </div>
      </div>
    </div>
  );
}