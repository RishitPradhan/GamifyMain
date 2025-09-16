import React, { useEffect, useRef, useState } from "react";

// Add Google Fonts for pixelated text
if (!document.querySelector('link[href*="Press+Start+2P"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

function createSimulator({
  massKg = 10,
  frictionCoeff = 0.08,
  airDragCoeff = 0.02,
  gravity = 9.81,
  finishLineX = 50,
  crashBarrierX = 55,
  successSpeedThreshold = 0.5,
  stopSpeedEpsilon = 0.02,
  maxTimeSec = 60
} = {}) {
  const state = {
    time: 0,
    x: 0,
    v: 0,
    a: 0,
    appliedForce: 0,
    status: "running",
    message: null
  };

  const setForce = (f) => {
    if (state.status !== "running") return;
    state.appliedForce = Number.isFinite(f) ? f : 0;
  };

  const getTelemetry = () => ({
    time: state.time,
    x: state.x,
    v: state.v,
    a: state.a,
    appliedForce: state.appliedForce,
    finishLineX,
    status: state.status,
    message: state.message
  });

  const step = (dt) => {
    if (state.status !== "running") return getTelemetry();

    // forces
    const forceUser = state.appliedForce;
    const normal = massKg * gravity;
    const coulombMag = frictionCoeff * normal;

    let forceRolling = 0;
    if (state.v > stopSpeedEpsilon) forceRolling = -coulombMag;
    else if (state.v < -stopSpeedEpsilon) forceRolling = coulombMag;
    else {
      const desiredDir = Math.sign(forceUser);
      forceRolling = -desiredDir * Math.min(Math.abs(forceUser), coulombMag);
    }

    const forceAir = -airDragCoeff * state.v * Math.abs(state.v);
    const net = forceUser + forceRolling + forceAir;

    state.a = net / massKg;
    state.v += state.a * dt;
    state.x += state.v * dt;
    state.time += dt;

    // end states
    if (state.x >= finishLineX && Math.abs(state.v) <= successSpeedThreshold) {
      state.status = "success";
      state.message = "Perfect Run!";
    } else if (state.x >= crashBarrierX || (state.x >= finishLineX && Math.abs(state.v) > successSpeedThreshold)) {
      state.status = "crashed";
      state.message = "Crashed!";
    } else {
      const insufficient = Math.abs(state.appliedForce) < frictionCoeff * massKg * gravity * 0.99;
      if (insufficient && Math.abs(state.v) <= stopSpeedEpsilon && state.x < finishLineX - 0.5) {
        state.status = "stopped";
        state.message = "Too Slow!";
      }
    }
    if (state.time > maxTimeSec && state.status === "running") {
      state.status = "stopped";
      state.message = "Timed Out";
    }
    return getTelemetry();
  };

  const reset = () => {
    state.time = 0; state.x = 0; state.v = 0; state.a = 0; state.appliedForce = 0;
    state.status = "running"; state.message = null;
  };

  return { setForce, step, reset, getTelemetry };
}

export default function MotionSimulatorGame({
  width = 720,
  height = 220,
  metersToPx = 12,
  massKg = 12
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const simRef = useRef(null);
  const [force, setForce] = useState(25);
  const [telemetry, setTelemetry] = useState({
    time: 0, x: 0, v: 0, a: 0, status: "running", message: ""
  });

  // simple particles for confetti/crash
  const particlesRef = useRef([]);

  useEffect(() => {
    const sim = createSimulator({
      massKg,
      finishLineX: 52,
      crashBarrierX: 56,
      airDragCoeff: 0.03
    });
    simRef.current = sim;
    sim.reset();
    sim.setForce(force);
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  useEffect(() => {
    simRef.current?.setForce(force);
  }, [force]);

  const start = () => {
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const state = simRef.current.step(dt);
      setTelemetry(state);
      draw(state);
      if (state.status !== "running" && particlesRef.current.length === 0) {
        spawnParticles(state);
      }
      updateParticles(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
  };

  const reset = () => {
    particlesRef.current = [];
    simRef.current.reset();
    simRef.current.setForce(force);
  };

  const spawnParticles = (state) => {
    const cx = 60 + state.x * metersToPx;
    const cy = height - 60;
    const color = state.status === "success" ? ["#ffde59","#00ffe7","#ff6ec7","#9a4dff"] : ["#999","#666","#bbb"];
    const n = state.status === "success" ? 60 : 30;
    for (let i = 0; i < n; i++) {
      particlesRef.current.push({
        x: cx, y: cy - 20, vx: (Math.random()-0.5)*200, vy: -Math.random()*220,
        r: state.status === "success" ? 3 : 2,
        g: 900, // gravity-like
        life: 1.2,
        color: color[i % color.length]
      });
    }
  };

  const updateParticles = (dt) => {
    particlesRef.current.forEach(p => {
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
  };

  const draw = (state) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Enable pixelated rendering
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0,0,width,height);

    // Enhanced pixelated background
    const grad = ctx.createLinearGradient(0,0,0,height);
    grad.addColorStop(0,"#0f0a1f");
    grad.addColorStop(0.3,"#1b1233");
    grad.addColorStop(0.7,"#2d1b4e");
    grad.addColorStop(1,"#4c1d95");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,width,height);

    // Add pixelated stars/particles in background
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % width;
      const y = (i * 73) % height;
      ctx.fillRect(x, y, 2, 2);
    }

    // Pixelated track with retro styling
    const groundY = height - 40;
    
    // Main track line with glow effect
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#7c3aed";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Pixelated track pattern
    ctx.fillStyle = "#4c1d95";
    for (let x = 0; x < width; x += 20) {
      ctx.fillRect(x, groundY + 2, 10, 4);
    }

    // Pixelated start/finish markers
    const startX = 60;
    const finishX = startX + state.finishLineX * metersToPx;
    const barrierX = startX + (state.finishLineX + 4) * metersToPx;

    // Start line with glow
    ctx.fillStyle = "#10b981";
    ctx.shadowColor = "#10b981";
    ctx.shadowBlur = 15;
    ctx.fillRect(startX-4, groundY-60, 8, 60);
    ctx.shadowBlur = 0;
    
    // Pixelated start flag pattern
    ctx.fillStyle = "#ffffff";
    for (let y = groundY-60; y < groundY-20; y += 8) {
      for (let x = startX+8; x < startX+24; x += 8) {
        if ((x + y) % 16 === 0) ctx.fillRect(x, y, 6, 6);
      }
    }

    // Finish line with golden glow
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 20;
    ctx.fillRect(finishX-4, groundY-70, 8, 70);
    ctx.shadowBlur = 0;
    
    // Pixelated finish flag
    ctx.fillStyle = "#000000";
    for (let y = groundY-70; y < groundY-20; y += 6) {
      for (let x = finishX+8; x < finishX+28; x += 6) {
        if ((x + y) % 12 === 0) ctx.fillRect(x, y, 4, 4);
      }
    }

    // Crash barrier with danger glow
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 15;
    ctx.fillRect(barrierX-4, groundY-60, 8, 60);
    ctx.shadowBlur = 0;
    
    // Danger stripes
    ctx.fillStyle = "#ffffff";
    for (let y = groundY-60; y < groundY; y += 12) {
      ctx.fillRect(barrierX-2, y, 4, 6);
    }

    // Pixelated cart/wagon
    const cartX = startX + state.x * metersToPx;
    const cartY = groundY - 20;
    
    // Enhanced speed lines when accelerating
    const accelMag = Math.min(1, Math.abs(state.a) / 5);
    if (accelMag > 0.1) {
      ctx.strokeStyle = `rgba(124, 58, 237, ${0.6 * accelMag})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#7c3aed";
      ctx.shadowBlur = 8;
      for (let i = 0; i < 8 * accelMag; i++) {
        const lx = cartX - 15 - Math.random()*40;
        const ly = cartY - 15 + Math.random()*30;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - 15 - Math.random()*15, ly);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // Pixelated wagon body with gradient and glow
    const bodyGrad = ctx.createLinearGradient(cartX-18, cartY-16, cartX+30, cartY);
    bodyGrad.addColorStop(0, "#00ffe7");
    bodyGrad.addColorStop(0.5, "#0891b2");
    bodyGrad.addColorStop(1, "#0e7490");
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = "#00ffe7";
    ctx.shadowBlur = 12;
    ctx.fillRect(cartX-18, cartY-16, 48, 16);
    ctx.shadowBlur = 0;
    
    // Pixelated wagon details
    ctx.fillStyle = "#ffffff";
    // Windows
    ctx.fillRect(cartX-12, cartY-12, 8, 6);
    ctx.fillRect(cartX+8, cartY-12, 8, 6);
    // Door handle
    ctx.fillRect(cartX+20, cartY-8, 2, 2);
    
    // Pixelated cargo area
    ctx.fillStyle = "#8b5cf6";
    ctx.fillRect(cartX-16, cartY-14, 44, 2);
    
    // Enhanced pixelated wheels with rotation effect
    const wheelRotation = (state.x * 2) % (Math.PI * 2);
    
    // Left wheel
    ctx.fillStyle = "#1f2937";
    ctx.shadowColor = "#374151";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cartX, groundY-4, 8, 0, Math.PI*2);
    ctx.fill();
    
    // Wheel spokes (pixelated)
    ctx.fillStyle = "#6b7280";
    for (let i = 0; i < 4; i++) {
      const angle = wheelRotation + (i * Math.PI / 2);
      const spokeX = cartX + Math.cos(angle) * 4;
      const spokeY = groundY - 4 + Math.sin(angle) * 4;
      ctx.fillRect(spokeX-1, spokeY-1, 2, 2);
    }
    
    // Right wheel
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.arc(cartX+22, groundY-4, 8, 0, Math.PI*2);
    ctx.fill();
    
    // Right wheel spokes
    ctx.fillStyle = "#6b7280";
    for (let i = 0; i < 4; i++) {
      const angle = wheelRotation + (i * Math.PI / 2);
      const spokeX = cartX + 22 + Math.cos(angle) * 4;
      const spokeY = groundY - 4 + Math.sin(angle) * 4;
      ctx.fillRect(spokeX-1, spokeY-1, 2, 2);
    }
    ctx.shadowBlur = 0;

    // particles
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Pixelated HUD with retro styling
    ctx.font = "10px 'Press Start 2P', 'Courier New', monospace";
    
    // HUD background
    ctx.fillStyle = "rgba(124, 58, 237, 0.3)";
    ctx.fillRect(8, 8, 200, 90);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 200, 90);
    
    // HUD text with glow effects
    ctx.fillStyle = "#e9d5ff";
    ctx.shadowColor = "#7c3aed";
    ctx.shadowBlur = 4;
    ctx.fillText(`⚡ FORCE: ${state.appliedForce.toFixed(1)} N`, 16, 24);
    ctx.fillText(`📍 POS: ${state.x.toFixed(2)} m`, 16, 38);
    ctx.fillText(`🏃 VEL: ${state.v.toFixed(2)} m/s`, 16, 52);
    ctx.fillText(`🚀 ACC: ${state.a.toFixed(2)} m/s²`, 16, 66);
    
    // Mission status
    ctx.fillText(`🎯 TARGET: ${state.finishLineX}m`, 16, 80);
    ctx.shadowBlur = 0;

    // Enhanced status messages - perfectly centered
    if (state.status !== "running") {
      const statusColor = state.status === "success" ? "#00ffe7" : 
                         (state.status === "crashed" ? "#ef4444" : "#FFD700");
      
      // Measure text first to get proper dimensions
      ctx.font = "14px 'Press Start 2P', 'Courier New', monospace";
      const statusText = state.status === "success" ? "🏆 " + (state.message || "") :
                        state.status === "crashed" ? "💥 " + (state.message || "") :
                        "⚠️ " + (state.message || "");
      
      const textWidth = ctx.measureText(statusText).width;
      const boxWidth = Math.max(280, textWidth + 40);
      const boxHeight = 70;
      
      // Status background - perfectly centered
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(width/2 - boxWidth/2, height/2 - boxHeight/2, boxWidth, boxHeight);
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(width/2 - boxWidth/2, height/2 - boxHeight/2, boxWidth, boxHeight);
      
      // Status text with enhanced glow - perfectly centered
      ctx.fillStyle = statusColor;
      ctx.shadowColor = statusColor;
      ctx.shadowBlur = 15;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(statusText, width/2, height/2);
      ctx.shadowBlur = 0;
      
      // Reset text alignment
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  };

  // Add CSS animations for enhanced effects
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes simulatorGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.4), inset 0 0 20px rgba(0,0,0,0.3); }
        50% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.6), inset 0 0 20px rgba(0,0,0,0.3); }
      }
      @keyframes titlePulse {
        0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
        50% { text-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 0.5); }
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f0a1f 0%, #1b1233 50%, #2d1b4e 100%)",
          border: "3px solid #7c3aed",
          borderRadius: "15px",
          padding: "20px",
          animation: "simulatorGlow 3s ease-in-out infinite",
          color: "#e9d5ff",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: "800px",
          textAlign: "center"
        }}
      >
      {/* Decorative corner elements */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "20px",
        height: "20px",
        background: "#7c3aed",
        clipPath: "polygon(0 0, 100% 0, 0 100%)"
      }} />
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "20px",
        height: "20px",
        background: "#7c3aed",
        clipPath: "polygon(100% 0, 100% 100%, 0 0)"
      }} />
      
      <h3 style={{ 
        color: "#FFD700", 
        margin: 0, 
        marginBottom: 15,
        fontSize: "1.2rem",
        textAlign: "center",
        animation: "titlePulse 2s ease-in-out infinite",
        letterSpacing: "2px"
      }}>🚗 MOTION SIMULATOR 🏁</h3>
      
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ 
          width: "100%", 
          maxWidth: width, 
          borderRadius: "12px",
          border: "2px solid #4c1d95",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(124, 58, 237, 0.3)",
          imageRendering: "pixelated"
        }} 
      />
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 15, 
        marginTop: 15, 
        flexWrap: "wrap",
        background: "rgba(124, 58, 237, 0.2)",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid #7c3aed"
      }}>
        <label style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10,
          fontSize: "0.8rem"
        }}>
          <span style={{
            color: "#e9d5ff",
            textShadow: "1px 1px 0px #4c1d95",
            minWidth: "80px"
          }}>⚡ FORCE:</span>
          <input
            type="range"
            min="-80"
            max="120"
            step="1"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            style={{ 
              width: 200,
              height: "8px",
              background: `linear-gradient(to right, #ef4444 0%, #7c3aed 50%, #10b981 100%)`,
              borderRadius: "4px",
              outline: "none",
              border: "2px solid #7c3aed",
              cursor: "pointer",
              imageRendering: "pixelated"
            }}
          />
          <input
            type="number"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            style={{ 
              width: 70, 
              padding: "8px", 
              borderRadius: "8px", 
              border: "2px solid #7c3aed", 
              background: "rgba(0,0,0,0.5)", 
              color: "#e9d5ff",
              fontFamily: "'Press Start 2P', 'Courier New', monospace",
              fontSize: "0.7rem",
              textAlign: "center"
            }}
          />
          <span style={{
            color: force > 50 ? "#FFD700" : force < -50 ? "#ef4444" : "#e9d5ff",
            fontSize: "0.7rem",
            minWidth: "20px"
          }}>N</span>
        </label>
        
        <button
          onClick={reset}
          style={{ 
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "0.7rem",
            padding: "12px 18px", 
            borderRadius: "10px", 
            background: "linear-gradient(135deg, #f59e0b, #d97706)", 
            border: "2px solid #f59e0b", 
            color: "#fff", 
            cursor: "pointer",
            textShadow: "1px 1px 0px #92400e",
            boxShadow: "0 4px 0 #92400e, 0 0 15px rgba(245, 158, 11, 0.3)",
            transition: "all 0.1s ease",
            imageRendering: "pixelated"
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
      </div>
    </div>
  );
}