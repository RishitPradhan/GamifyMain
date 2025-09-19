import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function ScienceAdventureLab() {
  const [showCards, setShowCards] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Keep the page calm: no animated sparkles
    setSparkles([]);
  }, []);

  // Preload background video for faster start on deploy
  useEffect(() => {
    try {
      const id = 'preload-study-video';
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'preload';
        link.as = 'video';
        link.href = '/study_pixel.mov';
        link.type = 'video/quicktime';
        document.head.appendChild(link);
      }
    } catch {}
  }, []);

  // Cards are visible immediately to reduce motion
  useEffect(() => {}, []);

  const chapters = useMemo(() => [
    { title: 'Crop Production and Management', category: 'Biology', icon: '🌱', status: 'locked', link: '/chapter1', pdfLink: '/pdfs/chapter1.pdf' },
    { title: 'Plant Life', category: 'Biology', icon: '🌿', status: 'locked', link: '/chapter2', pdfLink: '/pdfs/chapter2.pdf' },
    { title: 'Animal Kingdom', category: 'Biology', icon: '🦁', status: 'locked', link: '/chapter3', pdfLink: '/pdfs/chapter3.pdf' },
    { title: 'Water Cycle', category: 'Earth', icon: '💧', status: 'locked', link: '/chapter4', pdfLink: '/pdfs/chapter4.pdf' },
    { title: 'Human Body', category: 'Biology', icon: '🫀', status: 'locked', link: '/chapter5', pdfLink: '/pdfs/chapter5.pdf' },
    { title: 'Electricity', category: 'Physics', icon: '⚡', status: 'locked', link: '/chapter6', pdfLink: '/pdfs/chapter6.pdf' },
    { title: 'Reaching The Age of Adolescence', category: 'Chemistry', icon: '🧪', status: 'locked', link: '/chapter7', pdfLink: '/pdfs/chapter7.pdf' },
    { title: 'Forces & Motion', category: 'Physics', icon: '⚙', status: 'available', link: '/chapter8', pdfLink: '/pdfs/chapter8.pdf' },
    { title: 'Light & Sound', category: 'Physics', icon: '📣', status: 'locked', link: '/chapter9', pdfLink: '/pdfs/chapter9.pdf' },
    { title: 'Earth Science', category: 'Earth', icon: '🪨', status: 'locked', link: '/chapter10', pdfLink: '/pdfs/chapter10.pdf' },
    { title: 'Space Exploration', category: 'Physics', icon: '🚀', status: 'locked', link: '/chapter11', pdfLink: '/pdfs/chapter11.pdf' },
    { title: 'Environmental Science', category: 'Earth', icon: '🍃', status: 'locked', link: '/chapter12', pdfLink: '/pdfs/chapter12.pdf' },
  ], []);

  const filteredChapters = activeTab === 'All'
    ? chapters
    : chapters.filter(ch => ch.category === activeTab);

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  return (
    <div className="sal-root" style={{ paddingTop: 96 }}>
      <div className="background-container">
        {/* Background study pixel video */}
        <video
          className="bg-video"
          src="/study_pixel.mov"
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/study_pixel.mov" type="video/quicktime" />
        </video>
        {/* Premium Background (animations disabled for a cleaner look) */}
        <div className="premium-bg-layer"></div>
        <div className="particle-system" style={{ display: 'none' }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="bg-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
        <div className="floating-shapes" style={{ display: 'none' }}>
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle premium-sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`,
              }}
            />
          ))}
          <div className="shape shape-1 premium-shape">🌟</div>
          <div className="shape shape-2 premium-shape">⭐</div>
          <div className="shape shape-3 premium-shape">✨</div>
          <div className="shape shape-4 premium-shape">🌈</div>
          <div className="shape shape-5 premium-shape">☁</div>
          <div className="shape shape-6 premium-shape">🎈</div>
          <div className="shape shape-7 premium-shape">🦋</div>
          <div className="shape shape-8 premium-shape">🌸</div>
          <div className="shape shape-9 premium-shape">🔬</div>
          <div className="shape shape-10 premium-shape">⚗️</div>
          <div className="shape shape-11 premium-shape">🧪</div>
          <div className="shape shape-12 premium-shape">🚀</div>
        </div>
        {/* Animated Grid Overlay */}
        <div className="grid-overlay"></div>
      </div>

      <header className="header premium-header">
        <div className="title-container premium-title-container" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <div className="title-glow-effect"></div>
          <h1 className="main-title premium-title">
            <span className="title-text premium-text">Super Science Explorers</span>
          </h1>
          {/* Title particles disabled to reduce motion */}
        </div>
        <p className="subtitle premium-subtitle" style={{ textAlign: 'center', alignSelf: 'stretch' }}>Discover, Learn, and Have Fun with Science!</p>
        {/* Badges removed per request */}
      </header>

      {/* Category tabs removed per request */}

      <div className="chapters-grid">
        {filteredChapters.map((chapter, index) => {
          const isAvailable = chapter.status === 'available';
          return (
            <div
              key={index}
              className={`premium-chapter-card ${showCards ? 'visible' : ''}`}
              style={{ transition: 'transform 120ms ease, box-shadow 120ms ease' }}
            >
              <div className="premium-card-gradient">
                <div className="premium-card-content">
                  {/* Animated Thumbnail Canvas */}
                  <div className="premium-thumbnail">
                    <canvas 
                      className="thumbnail-canvas"
                      width="200"
                      height="150"
                      ref={el => {
                        if (el && !el.dataset.rendered) {
                          el.dataset.rendered = 'true';
                          const canvas = el;
                          const ctx = canvas.getContext('2d');
                          const width = canvas.width;
                          const height = canvas.height;
                          // Transparent thumbnail background: no gradient/grid
                          ctx.clearRect(0, 0, width, height);

                          // Lightweight animated thumbnail based on category
                          const category = (chapter.category || '').toLowerCase();
                          const title = (chapter.title || '').toLowerCase();
                          let rid = 0;
                          let t0 = performance.now();
                          const rand = (n)=> Math.floor(Math.random()*n);

                          // Color palettes per topic for vibrant yet readable glow
                          const palettes = {
                            physics: ['#60a5fa','#34d399','#f59e0b'],
                            biology: ['#a7f3d0','#86efac','#22c55e'],
                            earth: ['#93c5fd','#a5b4fc','#f5d0fe'],
                            chemistry: ['#fca5a5','#f59e0b','#fcd34d'],
                            water: ['#22d3ee','#60a5fa','#a78bfa'],
                            space: ['#93c5fd','#f5d0fe','#fde68a'],
                            human: ['#fda4af','#fb7185','#fecaca'],
                            plant: ['#86efac','#4ade80','#34d399'],
                            animal: ['#fde68a','#fca5a5','#fcd34d'],
                            environment: ['#86efac','#bbf7d0','#4ade80'],
                          };

                          // Custom: Baby animal hugs mother (for "Animal Kingdom")
                          const drawAnimalHug = (t)=>{
                            const W = width, H = height;
                            const time = t * 0.001;
                            // Sky
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#6fb9ff');
                            sky.addColorStop(1,'#dff5ff');
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Tall, still trees (background) with varied heights and spacing
                            const groundY = H*0.8;
                            const trees = [
                              { x: W*0.20, h: 48 }, // taller
                              { x: W*0.48, h: 36 }, // shorter
                              { x: W*0.76, h: 44 }, // medium
                            ];
                            trees.forEach(({x:tx, h})=>{
                              const trunkTop = groundY - h;
                              // Trunk base shadow
                              ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#000';
                              ctx.beginPath(); ctx.ellipse(tx, groundY-1, 10, 3, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
                              // Trunk gradient
                              const tg = ctx.createLinearGradient(tx, trunkTop, tx, groundY);
                              tg.addColorStop(0, '#7a5a4a');
                              tg.addColorStop(1, '#5b4035');
                              ctx.fillStyle = tg;
                              ctx.fillRect(tx-2.2, trunkTop, 4.4, groundY - trunkTop);
                              // Subtle branch hints
                              ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
                              ctx.beginPath(); ctx.moveTo(tx-1, trunkTop+Math.min(14, h*0.35)); ctx.lineTo(tx-6, trunkTop+Math.min(18, h*0.45)); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(tx+1, trunkTop+Math.min(22, h*0.55)); ctx.lineTo(tx+6, trunkTop+Math.min(26, h*0.65)); ctx.stroke();
                              // Canopy: layered ellipses with gradient + highlight
                              const cg = ctx.createLinearGradient(tx, trunkTop-16, tx, trunkTop+10);
                              cg.addColorStop(0, '#57c264');
                              cg.addColorStop(1, '#2f8a3a');
                              ctx.fillStyle = cg;
                              const cw = Math.min(18 + (h-36)*0.2, 26); // canopy width scales with height
                              const ch = Math.min(11 + (h-36)*0.12, 16);
                              ctx.beginPath(); ctx.ellipse(tx, trunkTop, cw, ch, 0, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.ellipse(tx- (cw*0.6), trunkTop+6, cw*0.65, ch*0.7, 0, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.ellipse(tx+ (cw*0.6), trunkTop+7, cw*0.65, ch*0.7, 0, 0, Math.PI*2); ctx.fill();
                              // Sunlit highlight
                              ctx.fillStyle = 'rgba(255,255,255,0.15)';
                              ctx.beginPath(); ctx.ellipse(tx-4, trunkTop-2, cw*0.4, ch*0.35, 0, 0, Math.PI*2); ctx.fill();
                            });

                            // Ground with slight gradient
                            const grass = ctx.createLinearGradient(0,groundY,0,H);
                            grass.addColorStop(0,'#66ce6a');
                            grass.addColorStop(1,'#3a9843');
                            ctx.fillStyle = grass; ctx.fillRect(0, groundY, W, H-groundY);

                            // Wind model for grass sway
                            const windAngle = Math.sin(time*0.7) * 0.4; // radians, -0.4..0.4
                            const windStrength = 6 + 4*Math.max(0, Math.sin(time*0.9)); // 6..10
                            const windX = Math.cos(windAngle) * windStrength;
                            const windY = Math.sin(windAngle) * 2;

                            const drawBlade = (x, baseY, h, thickness, tint, phase)=>{
                              const sway = Math.sin(time*1.8 + phase) * 2;
                              const ctrlX = x - (windX*0.15 + sway);
                              const ctrlY = baseY - h*0.5 + windY;
                              const tipX  = x - (windX*0.28 + sway*0.6);
                              const tipY  = baseY - h;
                              ctx.strokeStyle = tint;
                              ctx.lineWidth = thickness;
                              ctx.beginPath();
                              ctx.moveTo(x, baseY);
                              ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
                              ctx.stroke();
                            };

                            // Midground grass layer (denser, lighter) - smaller
                            for (let i=0;i<32;i++){
                              const x = (i+0.5) * (W/32);
                              const h = 6 + (i%3)*2; // reduced height
                              drawBlade(x, groundY+2, h, 0.8, 'rgba(110,190,110,0.85)', i*0.6);
                            }

                            // Foreground grass blades (fewer) - smaller
                            for (let i=0;i<20;i++){
                              const x = (i*W/20) + 4;
                              const h = 8 + (i%4)*2; // reduced height
                              drawBlade(x, groundY+4, h, 1.0, 'rgba(70,150,70,0.95)', i*0.8);
                            }

                            // Tiny background grass layer for fullness
                            for (let i=0;i<28;i++){
                              const x = (i+0.25) * (W/28);
                              const h = 4 + (i%2)*1;
                              drawBlade(x, groundY+1, h, 0.6, 'rgba(140,200,140,0.7)', i*0.5);
                            }

                            // Easing for walk progress 0..1
                            const ease = (x)=> x*x*(3-2*x);
                            const raw = (Math.sin(time*0.7)*0.5 + 0.5);
                            const walkT = ease(raw);

                            // Positions (align feet to ground)
                            const babyX = W*0.12 + walkT * (W*0.5);
                            const babyY = groundY; // local y=0 touches ground
                            const momX = W*0.76; const momY = groundY; // local y=0 touches ground
                            const dx = momX - babyX;
                            const hugging = dx < 22;

                            // Helper: draw a quadruped (bear/calf-like) with more detail
                            const drawQuad = (opts)=>{
                              const {x,y,scale=1,flip=false,body='#6b5043',accent='#e8d9cf',step=0,headTilt=0,tail=0,eyes=true,legAmp=1.2} = opts;
                              ctx.save(); ctx.translate(x,y); ctx.scale(flip? -scale: scale, scale);
                              // Body with subtle gradient
                              const bg = ctx.createLinearGradient(0,-10,0,0);
                              bg.addColorStop(0, body);
                              bg.addColorStop(1, '#5a4136');
                              ctx.fillStyle = bg;
                              ctx.beginPath(); ctx.ellipse(0, -10, 11, 8, 0, 0, Math.PI*2); ctx.fill();
                              // Belly accent
                              ctx.fillStyle = 'rgba(255,255,255,0.15)';
                              ctx.beginPath(); ctx.ellipse(-1, -9, 6, 4.5, 0, 0, Math.PI*2); ctx.fill();
                              // Head
                              ctx.save(); ctx.translate(9, -15); ctx.rotate(headTilt);
                              ctx.fillStyle = body;
                              ctx.beginPath(); ctx.ellipse(0, 0, 6.2, 5.5, 0, 0, Math.PI*2); ctx.fill();
                              // Muzzle
                              ctx.fillStyle = accent;
                              ctx.beginPath(); ctx.ellipse(1.5, 1.2, 3.2, 2.2, 0, 0, Math.PI*2); ctx.fill();
                              // Nose
                              ctx.fillStyle = '#3a2b26'; ctx.beginPath(); ctx.arc(3, 0.8, 0.8, 0, Math.PI*2); ctx.fill();
                              // Eyes
                              if (eyes){ ctx.fillStyle = '#1f1f1f'; ctx.beginPath(); ctx.arc(-1.5, -1.2, 0.7, 0, Math.PI*2); ctx.fill(); }
                              // Ears
                              ctx.fillStyle = body; ctx.beginPath(); ctx.arc(-3.6, -3.8, 1.6, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.arc(3.6, -3.8, 1.6, 0, Math.PI*2); ctx.fill();
                              ctx.restore();
                              // Legs end exactly at ground (local y=0). Use opposite-phase swing and slight horizontal offsets
                              const swingA = Math.sin(step) * legAmp;            // left side
                              const swingB = Math.sin(step + Math.PI) * legAmp;  // right side
                              ctx.fillStyle = body;
                              // horizontal offsets emulate forward/back stepping
                              const hindLX = -8 + swingA*0.5;
                              const hindRX = -3 + swingB*0.5;
                              const foreLX =  2 + swingB*0.5;
                              const foreRX =  7 + swingA*0.5;
                              // hind legs
                              ctx.fillRect(hindLX, -6 + swingA*0.35, 3, 6 - swingA*0.35);
                              ctx.fillRect(hindRX, -6 + swingB*0.35, 3, 6 - swingB*0.35);
                              // forelegs (diagonal pair alternation)
                              ctx.fillRect(foreLX, -6 + swingB*0.35, 3, 6 - swingB*0.35);
                              ctx.fillRect(foreRX, -6 + swingA*0.35, 3, 6 - swingA*0.35);
                              // Tail (small wag)
                              ctx.save(); ctx.translate(-11, -13); ctx.rotate(tail);
                              ctx.strokeStyle = body; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-4, -2); ctx.stroke(); ctx.restore();
                              ctx.restore();
                            };

                            // Remove shadows: animals now touch the ground directly

                            // Mother stays still (no leg motion, minimal head tilt), only tail wags
                            const momHeadTilt = hugging ? -0.12 : -0.02;
                            drawQuad({x:momX, y:momY, scale:1.25, flip:true, body:'#5f463a', accent:'#e5d6cc', step: 0, headTilt:momHeadTilt, tail: Math.sin(time*4)*0.25, legAmp: 0});
                            // Baby walks with tail wag and slight head bob
                            const babyHeadTilt = hugging ? 0.12 : 0.06;
                            drawQuad({x:babyX, y:babyY, scale:0.9, flip:false, body:'#7a5a4a', accent:'#eddecc', step: time*9 + Math.PI, headTilt:babyHeadTilt, tail: Math.sin(time*9)*0.35, legAmp: 3.0});

                            // Hug overlay: baby foreleg reaches out, mother foreleg wraps
                            if (hugging){
                              // Baby reaching arm
                              ctx.fillStyle = '#7a5a4a';
                              ctx.fillRect(babyX+6, babyY-15, 3, 7);
                              // Mother wrapping arm
                              ctx.fillStyle = '#5f463a';
                              ctx.fillRect(momX-9, momY-16, 3, 9);
                              // Hearts: smaller and more, gently rising
                              for (let i=0;i<8;i++){
                                const a = time*1.6 + i*0.45;
                                const hx = (babyX+momX)/2 + Math.cos(a)*3.2;
                                const hy = (babyY+momY)/2 - 16 - i*2.5 - (a%1)*7;
                                ctx.fillStyle = 'rgba(255,90,120,0.85)';
                                ctx.beginPath();
                                ctx.moveTo(hx, hy);
                                ctx.arc(hx-1.4, hy-1.8, 1.4, 0, Math.PI, true);
                                ctx.arc(hx+1.4, hy-1.8, 1.4, 0, Math.PI, true);
                                ctx.lineTo(hx, hy+2.2);
                                ctx.closePath(); ctx.fill();
                            // Right side intentionally left empty (girl removed)
                              }
                            }
                          };
                          // Custom: Plant growth from seed (for "Plant Life")
                          const drawPlantGrowth = (t)=>{
                            const W = width, H = height;
                            const time = t * 0.001;

                            // Clear frame
                            ctx.clearRect(0,0,W,H);

                            // Bright day sky
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#6cc8ff');
                            sky.addColorStop(0.7,'#9bdcff');
                            sky.addColorStop(1,'#cfefff');
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Sun and bloom glow
                            const sunX = W*0.86, sunY = H*0.16, sunR = 11;
                            const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR*3.2);
                            sunGlow.addColorStop(0,'rgba(255,243,128,0.95)');
                            sunGlow.addColorStop(1,'rgba(255,243,128,0)');
                            ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(sunX, sunY, sunR*3.2, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = '#fff59d'; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI*2); ctx.fill();

                            // Gentle cloud puffs
                            const cloud = (cx, cy, s)=>{
                              ctx.fillStyle = 'rgba(255,255,255,0.92)';
                              ctx.beginPath(); ctx.arc(cx, cy, 6*s, 0, Math.PI*2);
                              ctx.arc(cx+7*s, cy-2*s, 5.5*s, 0, Math.PI*2);
                              ctx.arc(cx+13*s, cy, 6.5*s, 0, Math.PI*2); ctx.fill();
                            };
                            cloud((time*10)% (W+40) - 20, H*0.2, 1.0);
                            cloud((time*8 + 80)% (W+40) - 20, H*0.28, 0.9);

                            // Ground with texture and light
                            const groundY = H*0.8;
                            const soilGrad = ctx.createLinearGradient(0,groundY,0,H);
                            soilGrad.addColorStop(0,'#8a5a3b');
                            soilGrad.addColorStop(1,'#5f3f2a');
                            ctx.fillStyle = soilGrad; ctx.fillRect(0, groundY, W, H-groundY);
                            // speckles
                            ctx.globalAlpha = 0.25;
                            ctx.fillStyle = '#3b2619';
                            for (let i=0;i<30;i++){
                              const sx = (i*37 + (time*40)) % W;
                              const sy = groundY + 4 + (i*11) % (H-groundY-6);
                              ctx.fillRect(sx, sy, 1, 1);
                            }
                            ctx.globalAlpha = 1;

                            // Shooting stars
                            for (let s=0; s<3; s++){
                              const prog = (time*0.35 + s*0.22) % 1; // 0..1
                              const sx = W*(1.1 - prog*1.3); // right to left
                              const sy = H*0.15 + Math.sin((s+1)*1.7 + time*1.3)*H*0.12 + prog*H*0.08;
                              const dx = -14, dy = 6; // streak direction
                              const g = ctx.createLinearGradient(sx, sy, sx+dx, sy+dy);
                              g.addColorStop(0,'rgba(255,255,255,0.0)');
                              g.addColorStop(1,'rgba(255,255,255,0.9)');
                              ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap='round';
                              ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx+dx, sy+dy); ctx.stroke();
                              // bright head
                              ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI*2); ctx.fill();
                            }

                            // Easing function for organic growth (smoothstep-ish)
                            const s = (x)=> x*x*(3-2*x);
                            const base = (Math.sin(time*0.6 - 1.4)+1)/2; // 0..1
                            const grow = s(Math.min(1, Math.max(0, base)));

                            // Seed (slight highlight)
                            const cx = W*0.5;
                            ctx.fillStyle = '#5b371e';
                            ctx.beginPath(); ctx.ellipse(cx, groundY-3, 4.2, 3.1, 0, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = 'rgba(255,255,255,0.25)';
                            ctx.beginPath(); ctx.ellipse(cx+1, groundY-3.8, 1.2, 0.8, 0, 0, Math.PI*2); ctx.fill();

                            // Root network
                            const rootLen = 20 * grow;
                            ctx.strokeStyle = '#a7744b'; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
                            ctx.beginPath(); ctx.moveTo(cx, groundY-2);
                            ctx.bezierCurveTo(cx-6, groundY+rootLen*0.35, cx+4, groundY+rootLen*0.7, cx-2, groundY+rootLen);
                            ctx.stroke();
                            // small lateral roots
                            ctx.beginPath(); ctx.moveTo(cx-2, groundY+rootLen*0.5); ctx.lineTo(cx-6, groundY+rootLen*0.55); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx+1, groundY+rootLen*0.7); ctx.lineTo(cx+5, groundY+rootLen*0.75); ctx.stroke();

                            // Curved stem with gradient
                            const stemMax = 44;
                            const stemLen = stemMax * grow;
                            const stemGrad = ctx.createLinearGradient(cx, groundY-2, cx, groundY-2-stemLen);
                            stemGrad.addColorStop(0,'#2e7d32');
                            stemGrad.addColorStop(1,'#44b049');
                            ctx.strokeStyle = stemGrad; ctx.lineWidth = 2.1; ctx.lineCap = 'round';
                            ctx.beginPath();
                            ctx.moveTo(cx, groundY-2);
                            ctx.bezierCurveTo(cx-4, groundY-12 - stemLen*0.25, cx+2, groundY-14 - stemLen*0.55, cx, groundY-2 - stemLen);
                            ctx.stroke();

                            // Leaves with gradient fill and veins
                            const leafProgress = Math.max(0, (grow-0.2)/0.8);
                            const sway = Math.sin(time*2.1) * 6;
                            const leaf = (x,y,flip,scale=1)=>{
                              ctx.save();
                              ctx.translate(x,y);
                              ctx.scale((flip? -1: 1)*scale, scale);
                              ctx.rotate((-0.35 + sway*0.01));
                              const lg = ctx.createLinearGradient(0,0,18,0);
                              lg.addColorStop(0,'#66d17a');
                              lg.addColorStop(1,'#2ea84b');
                              ctx.fillStyle = lg;
                              ctx.beginPath();
                              ctx.moveTo(0,0);
                              ctx.quadraticCurveTo(12, -7, 22, -3);
                              ctx.quadraticCurveTo(10, 6, 0,0);
                              ctx.fill();
                              // veins
                              ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.7;
                              ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(16,-2); ctx.stroke();
                              ctx.lineWidth = 0.6; ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                              ctx.beginPath(); ctx.moveTo(8,-3); ctx.lineTo(12,-1); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(6,-1); ctx.lineTo(10,1); ctx.stroke();
                              ctx.restore();
                            };

                            // stem tip
                            const tipY = groundY-2 - stemLen;
                            // First pair
                            if (leafProgress > 0){
                              const y1 = groundY-12 - stemLen*0.33;
                              const off1 = 9*leafProgress;
                              leaf(cx - off1, y1, true, 0.95);
                              leaf(cx + off1, y1+1, false, 0.95);
                            }
                            // Second pair
                            if (leafProgress > 0.45){
                              const y2 = groundY-24 - stemLen*0.62;
                              const off2 = 12*(leafProgress-0.45)/0.55;
                              leaf(cx - off2, y2, true, 1.05);
                              leaf(cx + off2, y2+1, false, 1.05);
                            }
                            // Third small pair near top
                            if (leafProgress > 0.75){
                              const y3 = groundY-30 - stemLen*0.82;
                              const off3 = 8*(leafProgress-0.75)/0.25;
                              leaf(cx - off3, y3, true, 0.8);
                              leaf(cx + off3, y3, false, 0.8);
                            }

                            // Blooming flower (petals)
                            const bloom = Math.max(0, (grow-0.85)/0.15); // 0..1
                            if (bloom > 0){
                              const petals = 6;
                              const r = 6 * bloom;
                              for (let i=0;i<petals;i++){
                                const a = (i/petals)*Math.PI*2 + Math.sin(time*1.2)*0.06;
                                const px = cx + Math.cos(a)*r*0.6;
                                const py = tipY - 2 + Math.sin(a)*r*0.6;
                                const pg = ctx.createRadialGradient(px, py, 0, px, py, r);
                                pg.addColorStop(0,'#fff3b0');
                                pg.addColorStop(1,'#ffc45a');
                                ctx.fillStyle = pg;
                                ctx.beginPath(); ctx.ellipse(px, py, 3.2, 2.2, a, 0, Math.PI*2); ctx.fill();
                              }
                              // center
                              ctx.fillStyle = '#7c4d16';
                              ctx.beginPath(); ctx.arc(cx, tipY-2, 1.8, 0, Math.PI*2); ctx.fill();
                            } else if (grow > 0.8){
                              // bud before bloom
                              ctx.fillStyle = '#2e7d32';
                              ctx.beginPath(); ctx.arc(cx, tipY-2, 2.2, 0, Math.PI*2); ctx.fill();
                            }

                            // Dewdrops on leaves near sunrise
                            if (grow > 0.6){
                              ctx.fillStyle = 'rgba(255,255,255,0.85)';
                              ctx.beginPath(); ctx.arc(cx+14, groundY-18 - stemLen*0.35, 1.2, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.arc(cx-10, groundY-26 - stemLen*0.62, 1.0, 0, Math.PI*2); ctx.fill();
                            }

                            // Soft plant shadow on ground
                            ctx.save();
                            ctx.globalAlpha = 0.25;
                            ctx.fillStyle = '#000';
                            ctx.beginPath(); ctx.ellipse(cx+6, groundY-2, 18, 5, -0.1, 0, Math.PI*2); ctx.fill();
                            ctx.restore();
                          };

                          // Earth Science: rotating Earth with magnifying glass zoom
                          const drawEarthScience = (t)=>{
                            const W = width, H = height; const time = t*0.001;
                            // Background space (deeper with nebula + vignette)
                            const bg = ctx.createLinearGradient(0,0,0,H);
                            bg.addColorStop(0,'#070b18'); bg.addColorStop(1,'#0f1530');
                            ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
                            // subtle nebula
                            const neb = ctx.createRadialGradient(W*0.75,H*0.3,0, W*0.75,H*0.3, Math.min(W,H)*0.6);
                            neb.addColorStop(0,'rgba(100,120,255,0.10)'); neb.addColorStop(1,'rgba(100,120,255,0)');
                            ctx.fillStyle = neb; ctx.beginPath(); ctx.arc(W*0.75,H*0.3, Math.min(W,H)*0.6, 0, Math.PI*2); ctx.fill();
                            // stars (varied sizes + twinkle)
                            for (let i=0;i<60;i++){
                              const sx = (i*97 + (time*30))%W; const sy = (i*43 + i*11)%H;
                              const tw = 0.6 + 0.4*Math.sin(time*3 + i);
                              const sz = (i%13===0)? 2: 1;
                              ctx.globalAlpha = 0.6 + 0.4*tw; ctx.fillStyle = (i%9===0)? '#ffd59e' : '#e5f0ff';
                              ctx.fillRect(W - sx, sy, sz, sz);
                            }
                            ctx.globalAlpha = 1;
                            // vignette
                            const vig = ctx.createRadialGradient(W*0.5,H*0.5, Math.min(W,H)*0.2, W*0.5,H*0.5, Math.min(W,H)*0.7);
                            vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.35)');
                            ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);

                            // Helper to draw globe at origin (0,0) with scale S and rotation rot
                            const drawGlobe = (S, rot)=>{
                              // base ocean
                              const ocean = ctx.createRadialGradient(-S*0.2,-S*0.2, S*0.1, 0,0,S);
                              ocean.addColorStop(0,'#2a9df4'); ocean.addColorStop(1,'#0b5fb3');
                              ctx.fillStyle = ocean; ctx.beginPath(); ctx.arc(0, 0, S, 0, Math.PI*2); ctx.fill();
                              // atmosphere glow
                              const atm = ctx.createRadialGradient(0,0, S*0.9, 0,0, S*1.08);
                              atm.addColorStop(0,'rgba(120,200,255,0.08)'); atm.addColorStop(1,'rgba(120,200,255,0.0)');
                              ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(0,0,S*1.08, 0, Math.PI*2); ctx.fill();
                              // mask for lat/long + land + clouds
                              ctx.save(); ctx.beginPath(); ctx.arc(0,0,S,0,Math.PI*2); ctx.clip();
                              // lat/long
                              ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
                              for (let lat=-60; lat<=60; lat+=30){
                                const r = Math.cos(lat*Math.PI/180)*S; const y = Math.sin(lat*Math.PI/180)*S*0.3;
                                ctx.beginPath(); ctx.ellipse(0, y, r, r*0.3, 0, 0, Math.PI*2); ctx.stroke();
                              }
                              // day/night shading
                              const shade = ctx.createLinearGradient(-S,0,S,0);
                              shade.addColorStop(0,'rgba(0,0,0,0.35)'); shade.addColorStop(0.5,'rgba(0,0,0,0.0)'); shade.addColorStop(1,'rgba(255,255,255,0.06)');
                              ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = shade; ctx.fillRect(-S, -S, S*2, S*2);
                              ctx.globalCompositeOperation = 'source-over';
                              // continents (rotate)
                              ctx.rotate(rot);
                              const blob = (x,y,rx,ry, col)=>{ ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x,y,rx,ry, 0, 0, Math.PI*2); ctx.fill(); };
                              // primary landmasses
                              blob(-S*0.28, -S*0.05, S*0.25, S*0.14, '#2fb56e');
                              blob(S*0.12,  S*0.03, S*0.20, S*0.12, '#2fb56e');
                              blob(S*0.05, -S*0.22, S*0.12, S*0.08, '#2fb56e');
                              // additional islands/continents for realism
                              blob(-S*0.10,  S*0.18, S*0.10, S*0.06, '#279f61');
                              blob(S*0.26,  -S*0.12, S*0.08, S*0.05, '#33c073');
                              blob(-S*0.32,  S*0.10, S*0.07, S*0.045, '#33c073');
                              blob( S*0.00,  S*0.24, S*0.06, S*0.04, '#279f61');
                              // more small islands
                              blob( S*0.20,  S*0.18, S*0.06, S*0.038, '#2fb56e');
                              blob(-S*0.20, -S*0.26, S*0.05, S*0.032, '#279f61');
                              blob( S*0.30,  S*0.04, S*0.045, S*0.030, '#33c073');
                              blob(-S*0.05,  S*0.02, S*0.055, S*0.034, '#2fb56e');
                              // clouds
                              ctx.globalAlpha = 0.22; ctx.fillStyle = '#ffffff';
                              const cloud = (x,y,rx,ry)=>{ ctx.beginPath(); ctx.ellipse(x,y,rx,ry, 0, 0, Math.PI*2); ctx.fill(); };
                              cloud(-S*0.15 + Math.sin(time*0.6)*3, -S*0.10, S*0.22, S*0.05);
                              cloud(S*0.05 + Math.sin(time*0.5+1.2)*3, S*0.00, S*0.18, S*0.045);
                              cloud(S*0.00 + Math.sin(time*0.7+2.0)*3, -S*0.22, S*0.14, S*0.04);
                              ctx.globalAlpha = 1;
                              ctx.restore();
                              // rim highlight
                              const rim = ctx.createRadialGradient(-S*0.2,-S*0.2, S*0.3, 0,0,S);
                              rim.addColorStop(0,'rgba(255,255,255,0.10)'); rim.addColorStop(1,'rgba(255,255,255,0)');
                              ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(0,0,S,0,Math.PI*2); ctx.fill();
                            };

                            // Earth center and rotation + small orbital revolution
                            const S = Math.min(W,H)*0.36; // larger earth
                            const rot = time*0.6; // axial rotation speed
                            const orbitR = S*0.10; const orbitAng = time*0.35;
                            const ex = W*0.46 + Math.cos(orbitAng)*orbitR;
                            const ey = H*0.50 + Math.sin(orbitAng)*orbitR;
                            ctx.save(); ctx.translate(ex, ey); drawGlobe(S*0.6, rot); ctx.restore();

                            // Magnifying glass position (rise from bottom then hold)
                            const lensTargetX = ex + S*0.12; const lensTargetY = ey - S*0.10; const lensR = S*0.25;
                            const cyc = 3.6; const p = (time % cyc)/cyc; const ease = x=> x*x*(3-2*x);
                            const riseK = Math.min(1, p/0.28); const k = ease(riseK);
                            const startY = H + lensR + 12; const lx = lensTargetX; const ly = startY + (lensTargetY - startY)*k;

                            // Magnified view within lens (clip and redraw globe scaled)
                            ctx.save();
                            ctx.beginPath(); ctx.arc(lx, ly, lensR, 0, Math.PI*2); ctx.clip();
                            ctx.translate(lx, ly);
                            const zoom = 1.75;
                            // Translate so that area under lens center magnifies correctly relative to globe center
                            ctx.scale(zoom, zoom);
                            // subtle refraction offset towards lens center
                            ctx.translate((ex - lx)/zoom + 0.8/zoom, (ey - ly)/zoom + 0.6/zoom);
                            drawGlobe(S*0.5, rot);
                            ctx.restore();

                            // Lens drop shadow
                            ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = '#000';
                            ctx.beginPath(); ctx.ellipse(lx + lensR*0.10, ly + lensR*0.85, lensR*0.9, lensR*0.25, 0.15, 0, Math.PI*2); ctx.fill(); ctx.restore();

                            // Lens rim (metal gradient)
                            const rimG = ctx.createLinearGradient(lx - lensR, ly - lensR, lx + lensR, ly + lensR);
                            rimG.addColorStop(0, '#cbd5e1'); rimG.addColorStop(0.5, '#94a3b8'); rimG.addColorStop(1, '#e2e8f0');
                            ctx.strokeStyle = rimG; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lx, ly, lensR, 0, Math.PI*2); ctx.stroke();
                            ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(lx, ly, lensR-3, 0, Math.PI*2); ctx.stroke();

                            // Glass sheen
                            ctx.save();
                            const sheen = ctx.createLinearGradient(lx - lensR, ly - lensR, lx + lensR, ly + lensR);
                            sheen.addColorStop(0, 'rgba(255,255,255,0.15)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
                            ctx.fillStyle = sheen; ctx.beginPath(); ctx.arc(lx, ly, lensR, 0, Math.PI*2); ctx.fill();
                            // diagonal highlight streak
                            ctx.globalAlpha = 0.35; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx - lensR*0.6, ly - lensR*0.4); ctx.lineTo(lx + lensR*0.1, ly - lensR*0.9); ctx.stroke();
                            ctx.restore();

                            // Handle (wooden with metal cap) — longer
                            ctx.strokeStyle = '#8b5e34'; ctx.lineWidth = 6; ctx.lineCap = 'round';
                            ctx.beginPath(); ctx.moveTo(lx + lensR*0.58, ly + lensR*0.58); ctx.lineTo(lx + lensR*1.35, ly + lensR*1.35); ctx.stroke();
                            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx + lensR*0.58, ly + lensR*0.58); ctx.lineTo(lx + lensR*0.86, ly + lensR*0.86); ctx.stroke();
                          };
                          const pick = (arr,i)=> arr[i%arr.length];
                          const makeGrad = (x1,y1,x2,y2, cols)=>{
                            const g = ctx.createLinearGradient(x1,y1,x2,y2);
                            cols.forEach((c, i)=> g.addColorStop(i/(cols.length-1), c));
                            return g;
                          };

                          // Build particles once per canvas
                          const particles = Array.from({length: 26}).map(()=>({
                            x: Math.random()*width,
                            y: Math.random()*height,
                            vx: (Math.random()*0.6-0.3),
                            vy: (Math.random()*0.6-0.3),
                            r: 1 + Math.random()*1.8,
                            a: 0.25 + Math.random()*0.35,
                          }));

                          // Water cycle state: vapor particles rising to form clouds
                          const waterSurfaceY = height*0.78;
                          const vapors = Array.from({length: 28}).map(()=>({
                            x: Math.random()*width,
                            y: waterSurfaceY + Math.random()*10,
                            s: 0.6 + Math.random()*0.9,
                            phase: Math.random()*Math.PI*2
                          }));
                          let cloudAccum = 0; // grows as vapors reach cloud base, slowly decays
                          // Precipitation state
                          const rainDrops = [];
                          let rainTimer = 0; // frames remaining of rain burst

                          const drawPhysics = (t)=>{
                            // Neon electron orbits with additive glow
                            const cols = palettes.physics;
                            const R = 26; const cx = width*0.5; const cy = height*0.55;
                            ctx.save();
                            ctx.globalCompositeOperation = 'lighter';
                            for (let k=0;k<3;k++){
                              ctx.strokeStyle = pick(cols,k);
                              ctx.lineWidth = 1.2;
                              ctx.beginPath(); ctx.ellipse(cx, cy, R+k*10, R*0.5+k*6, (k*0.3), 0, Math.PI*2); ctx.stroke();
                            }
                            for (let k=0;k<3;k++){
                              const ang = t*0.002 + k*2.1;
                              const ex = cx + Math.cos(ang)*(R+k*10);
                              const ey = cy + Math.sin(ang)*(R*0.5+k*6);
                              ctx.fillStyle = pick(cols,k);
                              ctx.beginPath(); ctx.arc(ex, ey, 2.4, 0, Math.PI*2); ctx.fill();
                            }
                            ctx.restore();
                          };

                          const drawBiology = (t)=>{
                            // Filaments with green gradient
                            const cols = palettes.biology;
                            ctx.lineWidth = 1.2;
                            for (let k=0;k<5;k++){
                              const oy = 15 + k*18;
                              ctx.strokeStyle = makeGrad(0,oy,width,oy,[pick(cols,k), pick(cols,k+1)]);
                              ctx.beginPath();
                              for (let x=0; x<width; x+=4){
                                const y = oy + Math.sin((x*0.08)+(t*0.004)+k)*4;
                                if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                              }
                              ctx.stroke();
                            }
                          };

                          const drawEarth = (t)=>{
                            // Drifting colored dust + soft horizon
                            const cols = palettes.earth;
                            ctx.save();
                            ctx.globalCompositeOperation = 'lighter';
                            particles.forEach((p,i)=>{
                              p.x += p.vx; p.y += p.vy;
                              if (p.x<0) p.x=width; if (p.x>width) p.x=0;
                              if (p.y<0) p.y=height; if (p.y>height) p.y=0;
                              ctx.fillStyle = pick(cols,i);
                              ctx.globalAlpha = p.a;
                              ctx.fillRect(p.x, p.y, 1.6, 1.6);
                            });
                            ctx.restore();
                            ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(0, height-18); ctx.lineTo(width, height-18); ctx.stroke();
                            ctx.globalAlpha = 1;
                          };

                          const drawChemistry = (t)=>{
                            // Bubbles with warm gradient stroke
                            const cols = palettes.chemistry;
                            for (let i=0;i<8;i++){
                              const x = (i+1)*width/9;
                              const y = height - ((t*0.03 + i*20) % (height+20));
                              ctx.strokeStyle = makeGrad(x-6,y-6,x+6,y+6,[pick(cols,i), pick(cols,i+1)]);
                              ctx.lineWidth = 1.2;
                              ctx.beginPath(); ctx.arc(x, y, 3 + (i%3), 0, Math.PI*2); ctx.stroke();
                            }
                          };

                          // Chapter-specific animations
                          const drawForcesMotion = (t)=>{
                            // Girl rolls a ball toward a brick wall; it rebounds and returns; loop continues
                            const W = width, H = height; const time = t*0.001;
                            // Evening scenery background (sunset sky, low sun, distant hills)
                            const bg = ctx.createLinearGradient(0,0,0,H);
                            bg.addColorStop(0,'#f59e0b'); // warm top
                            bg.addColorStop(1,'#fde68a'); // soft bottom
                            ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
                            // setting sun near horizon
                            const sunX=W*0.16, sunY=H*0.70, sunR=10; let glow=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunR*5);
                            glow.addColorStop(0,'rgba(255,200,120,0.85)'); glow.addColorStop(1,'rgba(255,200,120,0)');
                            ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sunX,sunY,sunR*5,0,Math.PI*2); ctx.fill();
                            ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(sunX,sunY,sunR,0,Math.PI*2); ctx.fill();
                            // distant hills
                            ctx.fillStyle = '#b7d4b9';
                            ctx.beginPath(); ctx.moveTo(0,H*0.65); ctx.quadraticCurveTo(W*0.25,H*0.55, W*0.5,H*0.65); ctx.quadraticCurveTo(W*0.75,H*0.75, W,H*0.68); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
                            ctx.fillStyle = '#9fcca7';
                            ctx.beginPath(); ctx.moveTo(0,H*0.72); ctx.quadraticCurveTo(W*0.35,H*0.62, W*0.7,H*0.72); ctx.quadraticCurveTo(W*0.88,H*0.80, W,H*0.76); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();

                            // Ground (slight curve toward the right wall)
                            const baseY = H*0.78;
                            ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1.2;
                            ctx.beginPath(); ctx.moveTo(8, baseY);
                            for (let x=8; x<=W-8; x+=4){
                              const y = baseY + Math.sin((x/W)*Math.PI*0.7)*6; // subtle slope
                              ctx.lineTo(x, y);
                            }
                            ctx.stroke();
                            // Foreground grass tufts (denser)
                            for (let i=0;i<28;i++){
                              const gx0 = (i+0.3)*W/28; const h = 6 + (i%4)*2; const phase = i*0.4;
                              const sway = Math.sin(time*1.6 + phase)*1.3;
                              ctx.strokeStyle = 'rgba(60,140,70,0.95)'; ctx.lineWidth = 1;
                              ctx.beginPath(); ctx.moveTo(gx0, baseY+2);
                              ctx.quadraticCurveTo(gx0-2-sway, baseY-h*0.5, gx0-1, baseY-h); ctx.stroke();
                            }
                            // Additional lighter grass layer
                            for (let i=0;i<20;i++){
                              const gx0 = (i+0.6)*W/20; const h = 4 + (i%3)*2; const phase = i*0.6;
                              const sway = Math.sin(time*1.2 + phase)*1.0;
                              ctx.strokeStyle = 'rgba(120,180,120,0.6)'; ctx.lineWidth = 0.8;
                              ctx.beginPath(); ctx.moveTo(gx0, baseY+1);
                              ctx.quadraticCurveTo(gx0-1.5-sway, baseY-h*0.5, gx0-0.5, baseY-h); ctx.stroke();
                            }

                            // Girl at left (more realistic, bigger hair/pony)
                            const gx = W*0.18, gS = Math.min(W,H)*0.16; // increased size
                            const gShoulderY = baseY - gS*0.65;
                            const gHeadY = baseY - gS*1.1;
                            // body (shirt + skirt)
                            ctx.fillStyle = '#7fb3d5'; ctx.beginPath(); ctx.roundRect(gx-gS*0.20, gShoulderY, gS*0.4, gS*0.42, 6); ctx.fill();
                            ctx.fillStyle = '#4d6fa7'; ctx.beginPath(); ctx.moveTo(gx-gS*0.22, gShoulderY+gS*0.38); ctx.lineTo(gx+gS*0.22, gShoulderY+gS*0.38); ctx.lineTo(gx+gS*0.16, gShoulderY+gS*0.58); ctx.lineTo(gx-gS*0.16, gShoulderY+gS*0.58); ctx.closePath(); ctx.fill();
                            // head
                            ctx.fillStyle = '#ffddc1'; ctx.beginPath(); ctx.ellipse(gx, gHeadY, gS*0.19, gS*0.24, 0, 0, Math.PI*2); ctx.fill();
                            // hair: larger crown + defined ponytail to the right
                            ctx.fillStyle = '#2f2f2f';
                            ctx.beginPath(); ctx.ellipse(gx- gS*0.01, gHeadY- gS*0.14, gS*0.26, gS*0.12, -0.25, 0, Math.PI*2); ctx.fill();
                            // ponytail band
                            ctx.fillStyle = '#ef476f'; ctx.beginPath(); ctx.ellipse(gx+gS*0.13, gHeadY- gS*0.06, gS*0.035, gS*0.022, 0, 0, Math.PI*2); ctx.fill();
                            // ponytail shape
                            ctx.fillStyle = '#2f2f2f';
                            ctx.beginPath();
                            ctx.moveTo(gx+gS*0.14, gHeadY- gS*0.06);
                            ctx.bezierCurveTo(gx+gS*0.30, gHeadY- gS*0.02, gx+gS*0.30, gHeadY+ gS*0.10, gx+gS*0.22, gHeadY+ gS*0.14);
                            ctx.bezierCurveTo(gx+gS*0.26, gHeadY+ gS*0.06, gx+gS*0.24, gHeadY- gS*0.02, gx+gS*0.18, gHeadY- gS*0.08);
                            ctx.closePath(); ctx.fill();
                            // eyes + smile
                            ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(gx- gS*0.06, gHeadY- gS*0.01, gS*0.015, gS*0.02, 0, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.ellipse(gx+ gS*0.06, gHeadY- gS*0.01, gS*0.015, gS*0.02, 0, 0, Math.PI*2); ctx.fill();
                            ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(gx- gS*0.06, gHeadY+ gS*0.08); ctx.quadraticCurveTo(gx, gHeadY+ gS*0.11, gx+ gS*0.06, gHeadY+ gS*0.08); ctx.stroke();
                            // legs
                            ctx.strokeStyle = '#ffddc1'; ctx.lineWidth = 4; ctx.lineCap = 'round';
                            ctx.beginPath(); ctx.moveTo(gx- gS*0.08, baseY- gS*0.18); ctx.lineTo(gx- gS*0.08, baseY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(gx+ gS*0.08, baseY- gS*0.18); ctx.lineTo(gx+ gS*0.08, baseY); ctx.stroke();
                            // shoes
                            ctx.strokeStyle = '#334155'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(gx- gS*0.14, baseY+1); ctx.lineTo(gx- gS*0.02, baseY+1); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(gx+ gS*0.02, baseY+1); ctx.lineTo(gx+ gS*0.14, baseY+1); ctx.stroke();
                            // right arm extends slightly when releasing ball
                            const armPhase = Math.sin(time*2.0)*0.5 + 0.5; // 0..1
                            const handX = gx + gS*0.26 + armPhase*gS*0.08;
                            const handY = gShoulderY + gS*0.22 - armPhase*gS*0.03;
                            ctx.strokeStyle = '#ffddc1'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx+ gS*0.20, gShoulderY+ gS*0.06); ctx.lineTo(handX, handY); ctx.stroke();
                            // left arm: gentle wave when ball is near return (p>0.5)
                            const wave = Math.max(0, Math.min(1, (Math.sin(time*3.2)*0.5+0.5))) * (Math.sin(time*2.0)>0?1:0);
                            const leftHandX = gx - gS*0.20 - wave*gS*0.06;
                            const leftHandY = gShoulderY + gS*0.18 - wave*gS*0.05;
                            ctx.beginPath(); ctx.moveTo(gx- gS*0.20, gShoulderY+ gS*0.08); ctx.lineTo(leftHandX, leftHandY); ctx.stroke();

                            // House at right (taller), replaces wall
                            const houseX = W*0.80;
                            const houseW = Math.min(36, W*0.14);
                            const houseH = Math.min(70, H*0.45);
                            const houseTop = baseY - houseH;
                            // house body
                            ctx.fillStyle = '#d97706';
                            ctx.fillRect(houseX, houseTop, houseW, houseH);
                            // roof
                            ctx.fillStyle = '#7c2d12';
                            ctx.beginPath(); ctx.moveTo(houseX-4, houseTop); ctx.lineTo(houseX+houseW+4, houseTop); ctx.lineTo(houseX+houseW*0.5, houseTop- houseW*0.4); ctx.closePath(); ctx.fill();
                            // windows
                            ctx.fillStyle = '#fde68a';
                            for (let r=0;r<3;r++){
                              const wy = houseTop + 8 + r* (houseH/3);
                              ctx.fillRect(houseX+6, wy, houseW-12, 6);
                            }

                            // Ball path param 0..1..0 with easing (roll out then return)
                            const cyc = 3.6; const p = (time % cyc) / cyc; const ease = x=> x*x*(3-2*x);
                            const k = p < 0.5 ? ease(p/0.5) : ease(1-((p-0.5)/0.5));
                            // Travel from near the girl until just before the house, then back
                            const start = gx + gS*0.30; const end = houseX - 10; // stop short of house by radius+pad later
                            const r = Math.min(W,H)*0.045; // larger ball radius for visibility
                            const bx = start + (end - start - r) * k;
                            const by = baseY + Math.sin((bx/W)*Math.PI*0.7)*6 - 3; // follow ground curve slightly above
                            // Ball rotation based on distance traveled
                            const travelled = (end-start)* (p<0.5? (p/0.5): (1-((p-0.5)/0.5)));
                            const rot = travelled / (2*Math.PI*r);
                            // Impact effect near house (when p ~ 0.5)
                            const impact = Math.max(0, 1 - Math.abs(p-0.5)*24); // spike around midpoint
                            if (impact > 0.01){
                              ctx.save(); ctx.globalAlpha = Math.min(0.4, impact*0.4);
                              ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
                              ctx.beginPath(); ctx.moveTo(houseX-6, houseTop+6); ctx.lineTo(houseX-2, houseTop+2); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(houseX-6, houseTop+30); ctx.lineTo(houseX-2, houseTop+34); ctx.stroke();
                              ctx.restore();
                            }

                            // Ball (filled + white outline for contrast)
                            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();
                            ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.stroke();
                            // stripe to show rotation
                            ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2; ctx.beginPath();
                            ctx.arc(bx, by, r*0.7, rot*Math.PI*2, rot*Math.PI*2 + Math.PI); ctx.stroke();
                          };

                          const drawElectricity = (t)=>{
                            // Bulb: sleeps with Zs -> turns on (eyes open + smile), Zs disappear
                            const W = width, H = height; const time = t*0.001;
                            // Background (dim room)
                            const bg = ctx.createLinearGradient(0,0,0,H);
                            bg.addColorStop(0,'#0f172a'); bg.addColorStop(1,'#1f2937');
                            ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

                            // Timeline 0..1
                            const cyc = 5.0; const p = (time % cyc) / cyc; // 0..1 (longer cycle)
                            const smooth = x=> x*x*(3-2*x);
                            // Phases
                            const sleepEnd=0.45, switchEnd=0.60, onHoldEnd=0.95; // longer glow duration
                            let onK; // 0(off)->1(on)
                            if (p < sleepEnd) onK = 0;
                            else if (p < switchEnd) onK = smooth((p-sleepEnd)/(switchEnd-sleepEnd));
                            else if (p < onHoldEnd) onK = 1;
                            else onK = smooth(1-((p-onHoldEnd)/(1-onHoldEnd)));

                            // Bulb positioning & scale
                            const cx = W*0.5, cy = H*0.55;
                            const S = Math.min(W, H) * 0.18; // glass radius scale

                            // Soft shadow under bulb base
                            ctx.save(); ctx.globalAlpha = 0.25;
                            ctx.fillStyle = '#000';
                            ctx.beginPath(); ctx.ellipse(cx, cy + S*1.25, S*0.9, S*0.25, 0, 0, Math.PI*2); ctx.fill();
                            ctx.restore();

                            // Cord and switch (flick during switch phase)
                            const cordX = Math.max(6, cx - S*1.6); const cordTop = 6; const cordBottom = cy - S*1.15; // shifted further left
                            ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2; ctx.lineCap = 'round';
                            ctx.beginPath(); ctx.moveTo(cordX, cordTop); ctx.lineTo(cordX, cordBottom); ctx.stroke();
                            // Switch handle
                            const inSwitch = p >= sleepEnd && p < switchEnd;
                            const swPhase = Math.max(0, Math.min(1, (p - sleepEnd) / (switchEnd - sleepEnd)));
                            const flick = inSwitch ? Math.sin(swPhase * 10) * 0.35 : 0;
                            const swLen = S*0.28;
                            ctx.save();
                            ctx.translate(cordX, cordBottom);
                            ctx.rotate(flick);
                            ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3;
                            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, swLen); ctx.stroke();
                            ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(0, swLen, 5, 5, 0, 0, Math.PI*2); ctx.fill();
                            ctx.restore();

                            // Light glow when on (brighter, warmer, larger)
                            if (onK > 0){
                              // inner warm glow
                              let glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S*3.6);
                              glow.addColorStop(0, `rgba(255,225,120,${0.45*onK})`);
                              glow.addColorStop(1, 'rgba(255,225,120,0)');
                              ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, S*3.6, 0, Math.PI*2); ctx.fill();
                              // outer subtle halo
                              glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S*5);
                              glow.addColorStop(0, `rgba(255,240,180,${0.18*onK})`);
                              glow.addColorStop(1, 'rgba(255,240,180,0)');
                              ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, S*5, 0, Math.PI*2); ctx.fill();
                            }

                            // Bulb glass
                            ctx.save();
                            ctx.translate(cx, cy);
                            // Glass body
                            ctx.fillStyle = `rgba(255,255,255,${0.06 + 0.12*onK})`;
                            ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.25*onK})`;
                            ctx.lineWidth = 1.2;
                            ctx.beginPath(); ctx.ellipse(0, 0, S*0.9, S*1.05, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                            // (Removed inner glass highlight/circle as requested)

                            // Filament mount
                            ctx.strokeStyle = `rgba(255,224,130,${0.4+0.6*onK})`;
                            ctx.lineWidth = 1.4;
                            ctx.beginPath(); ctx.moveTo(-S*0.35, S*0.15); ctx.lineTo(S*0.35, S*0.15); ctx.stroke();
                            // Filament
                            const filCol = onK>0.1? `rgba(255,193,7,${0.6+0.4*onK})` : 'rgba(180,170,150,0.5)';
                            ctx.strokeStyle = filCol; ctx.lineWidth = 1.6;
                            ctx.beginPath();
                            ctx.moveTo(-S*0.3, S*0.1);
                            ctx.quadraticCurveTo(-S*0.15, -S*0.05, 0, S*0.05);
                            ctx.quadraticCurveTo(S*0.15, -S*0.05, S*0.3, S*0.1);
                            ctx.stroke();

                            // Bulb base (cap)
                            ctx.fillStyle = '#9aa4ad';
                            ctx.beginPath(); ctx.rect(-S*0.35, S*0.95, S*0.7, S*0.28); ctx.fill();
                            // screw lines
                            ctx.strokeStyle = '#7b8791'; ctx.lineWidth = 1;
                            for (let k=0;k<3;k++){ ctx.beginPath(); ctx.moveTo(-S*0.34, S*0.95 + k*(S*0.28/3)); ctx.lineTo(S*0.34, S*0.95 + k*(S*0.28/3)); ctx.stroke(); }

                            // Eyes and mouth on glass front
                            const eyeY = -S*0.05, eyeX = S*0.22;
                            if (onK < 0.2){
                              // sleeping: closed eyes (curved lines)
                              ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1.4;
                              ctx.beginPath(); ctx.moveTo(-eyeX-3, eyeY); ctx.quadraticCurveTo(-eyeX, eyeY+4, -eyeX+3, eyeY); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(eyeX-3, eyeY); ctx.quadraticCurveTo(eyeX, eyeY+4, eyeX+3, eyeY); ctx.stroke();
                              // neutral mouth
                              ctx.beginPath(); ctx.moveTo(-4, S*0.22); ctx.lineTo(4, S*0.22); ctx.stroke();
                            } else {
                              // awake: open eyes
                              ctx.fillStyle = '#222';
                              ctx.beginPath(); ctx.ellipse(-eyeX, eyeY, 3.2, 3.8, 0, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.ellipse(eyeX, eyeY, 3.2, 3.8, 0, 0, Math.PI*2); ctx.fill();
                              // smile
                              ctx.strokeStyle = '#222'; ctx.lineWidth = 1.6;
                              ctx.beginPath(); ctx.arc(0, S*0.23, 8, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
                            }

                            ctx.restore();

                            // Z letters float up when sleeping
                            if (onK < 0.2){
                              const zCount = 3;
                              for (let i=0;i<zCount;i++){
                                const phase = (time*0.6 + i*0.33);
                                const zX = cx + S*0.9 + i*10 + Math.sin(phase)*3;
                                const zY = cy - S*0.6 - (phase%1)*30;
                                ctx.globalAlpha = 0.6 * (1 - (phase%1));
                                ctx.fillStyle = '#cbd5e1';
                                ctx.font = `${Math.max(8, S*0.28)|0}px sans-serif`;
                                ctx.fillText('Z', zX, zY);
                                ctx.globalAlpha = 1;
                              }
                            }

                            // Rays when on
                            if (onK > 0.4){
                              ctx.strokeStyle = `rgba(255,234,130,${0.9*onK})`; ctx.lineWidth = 1.6;
                              for (let r=0;r<8;r++){
                                const ang = r*(Math.PI*2/8) + time*0.2;
                                const r1 = S*1.0, r2 = S*(1.6 + 0.4*Math.sin(time*1.5 + r));
                                ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang)*r1, cy + Math.sin(ang)*r1);
                                ctx.lineTo(cx + Math.cos(ang)*r2, cy + Math.sin(ang)*r2); ctx.stroke();
                              }
                            }
                          };

                          const drawLightSound = (t)=>{
                            // Space background with stars; light vs sound waves in opposite directions; 'VS' glowing in center
                            const W=width, H=height; const time=t*0.001;
                            // Space gradient
                            const spaceG = ctx.createLinearGradient(0,0,0,H);
                            spaceG.addColorStop(0,'#0b1020'); spaceG.addColorStop(1,'#141a2c');
                            ctx.fillStyle = spaceG; ctx.fillRect(0,0,W,H);
                            // Stars
                            ctx.globalAlpha=0.9; for (let i=0;i<40;i++){
                              const sx = (i*73 + (time*40))%W;
                              const sy = (i*53 + i*7)%H;
                              ctx.fillStyle = i%7===0? '#ffd166' : '#e5e7eb';
                              ctx.fillRect(W - sx, sy, 1, 1);
                            } ctx.globalAlpha=1;

                            // Light: white→blue gradient light wave (left side), higher amplitude, within bounds
                            const waveLeft = Math.max(8, W*0.02);
                            const waveRight = Math.min(W*0.36, W*0.40 - 14);
                            const waveY = H*0.44; // reference height for alignment
                            const ampBase = Math.max(6, Math.min(W,H)*0.05*0.6);
                            const amp = Math.min(18, ampBase * 1.5); // higher amplitude
                            const kx = 0.14; // spatial frequency
                            const phase = time*4.0; // temporal phase
                            // Gradient for core wave
                            const waveGrad = ctx.createLinearGradient(waveLeft, 0, waveRight, 0);
                            waveGrad.addColorStop(0, '#ffffff');
                            waveGrad.addColorStop(1, '#60a5fa');
                            // Outer glow pass
                            ctx.save(); ctx.globalAlpha = 0.28; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.beginPath();
                            for (let x = waveLeft, i=0; x <= waveRight; x += 2, i++){
                              const y = waveY + Math.sin(x*kx - phase) * amp;
                              if (i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke(); ctx.restore();
                            // Core wave pass with gradient
                            ctx.strokeStyle = waveGrad; ctx.lineWidth = 2.6; ctx.beginPath();
                            for (let x = waveLeft, i=0; x <= waveRight; x += 1.2, i++){
                              const y = waveY + Math.sin(x*kx - phase) * (amp*0.95);
                              if (i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke();
                            // Tapered tail at the right end of the light wave (non-triangular)
                            const tailY = waveY + Math.sin(waveRight*kx - phase) * (amp*0.95);
                            const tipX = waveRight + 6, tipY = tailY;
                            for (let n=0; n<4; n++){
                              const w = 4 - n*0.9;
                              const a = 0.45 - n*0.09;
                              ctx.strokeStyle = `rgba(96,165,250,${a})`; // #60a5fa with fade
                              ctx.lineWidth = w; ctx.lineCap = 'round';
                              ctx.beginPath(); ctx.moveTo(waveRight - n*2, tailY); ctx.lineTo(tipX, tipY); ctx.stroke();
                            }

                            // Sound: realistic echoing waves moved further right
                            const scX = W*0.85, scY = waveY; const maxR = Math.min(W,H)*0.22;
                            const rings = 6; const speed = 0.9;
                            // Sound source (simple speaker)
                            ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.roundRect(scX-5, scY-5, 10, 10, 2); ctx.fill();
                            ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(scX, scY, 3, 0, Math.PI*2); ctx.fill();
                            
                            for (let j=0; j<rings; j++){
                              const phase = (time*speed + j*0.25) % 1;
                              const r = 8 + phase * maxR;
                              const a = (1 - phase) * 0.65;
                              const thickness = 1.8 + (1-phase)*0.7;
                              ctx.strokeStyle = `rgba(52,211,153,${a})`;
                              ctx.lineWidth = thickness;
                              ctx.beginPath(); ctx.arc(scX, scY, r, 0, Math.PI*2); ctx.stroke();
                            }

                            // Thunder strike between 'V' and 'S' (brief flash, forked, loops)
                            {
                              const cx = W*0.5, cy = H*0.5;
                              const tcyc = 2.4; const pp = (time % tcyc) / tcyc; // 0..1
                              const active = (pp > 0.16 && pp < 0.32);
                              if (active){
                                // Flicker for realism
                                const flick = 0.85 + 0.15*Math.sin(time*50.0);
                                const radius = Math.min(W,H)*0.22;
                                // Glow behind bolt
                                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                                g.addColorStop(0, `rgba(180,220,255,${0.22*flick})`);
                                g.addColorStop(1, 'rgba(180,220,255,0)');
                                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2); ctx.fill();
                                
                                // Build a forked bolt with deterministic jitter
                                const segs = 6; const len = 6; // segment length
                                const pts = [{x: cx-4, y: cy-22}];
                                for (let i=1;i<=segs;i++){
                                  const prev = pts[i-1];
                                  const jx = Math.sin((i*13.7)+time*12)*3; // side jitter
                                  const jy = len; // downward
                                  pts.push({x: prev.x + jx, y: prev.y + jy});
                                }
                                // Outer bolt (blue-white)
                                ctx.strokeStyle = `rgba(147,197,253,${0.9*flick})`; // light blue
                                ctx.lineWidth = 3; ctx.lineCap='round';
                                ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
                                for (let i=1;i<pts.length;i++){ ctx.lineTo(pts[i].x, pts[i].y); }
                                ctx.stroke();
                                // Inner core (white)
                                ctx.strokeStyle = `rgba(255,255,255,${1.0*flick})`; ctx.lineWidth = 1.4;
                                ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
                                for (let i=1;i<pts.length;i++){ ctx.lineTo(pts[i].x, pts[i].y); }
                                ctx.stroke();
                                // Branches
                                const branch = (startIdx, dir)=>{
                                  const p = pts[startIdx];
                                  const bx = p.x + (dir? 6: -6);
                                  const by = p.y + 8;
                                  ctx.strokeStyle = `rgba(255,255,255,${0.8*flick})`; ctx.lineWidth = 1.2;
                                  ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(bx, by); ctx.stroke();
                                };
                                branch(2, true); branch(3, false);
                              }
                            }

                            // VS glowing text in the middle
                            const cx=W*0.5, cy=H*0.5;
                            const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.25);
                            glow.addColorStop(0, 'rgba(255,255,255,0.10)');
                            glow.addColorStop(1, 'rgba(255,255,255,0)');
                            ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx,cy,Math.min(W,H)*0.25,0,Math.PI*2); ctx.fill();
                            ctx.fillStyle = '#ffd166';
                            ctx.font = `${Math.max(14, Math.min(W,H)*0.25|0)}px sans-serif`;
                            ctx.textAlign='center'; ctx.textBaseline='middle';
                            // shimmering alpha
                            ctx.save(); ctx.globalAlpha = 0.8 + 0.2*Math.sin(time*3.0);
                            ctx.fillText('VS', cx, cy);
                            ctx.restore();
                          };

                          // New: Reaching The Age of Adolescence animation
                          const drawAdolescence = (t)=>{
                            const W = width, H = height; const time = t*0.001;
                            // Background
                            const bg = ctx.createLinearGradient(0,0,0,H);
                            bg.addColorStop(0,'#ecf4ff'); bg.addColorStop(1,'#ffffff');
                            ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
                            const baseY = H*0.86;
                            // Ground
                            ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(12, baseY+2); ctx.lineTo(W-12, baseY+2); ctx.stroke();

                            // Positions for 4 stages
                            const xs = [W*0.14, W*0.34, W*0.58, W*0.82];
                            const scales = [0.68, 0.92, 1.18, 1.42]; // larger figures
                            const colors = ['#a3cef1','#7fb3d5','#5aa0d6','#3c8bd0'];

                            const drawPerson = (px, s, tone, phase)=>{
                              const S = Math.min(W,H)*0.07*s;
                              const hipY = baseY - 0.6*S;
                              const shoulderY = baseY - 1.9*S;
                              const headY = baseY - 3*S;
                              const walk = Math.sin(time*2.2 + phase);
                              const step = (0.25 + 0.15*s) * walk; // stride based on scale

                              // Torso (shirt)
                              ctx.fillStyle = tone;
                              ctx.beginPath(); ctx.roundRect(px-0.55*S, shoulderY, 1.1*S, 1.3*S, 6); ctx.fill();
                              // Pants/shorts
                              ctx.fillStyle = '#475569';
                              ctx.fillRect(px-0.5*S, hipY, 1.0*S, 0.5*S);

                              // Legs (upper + lower) with simple joints
                              const upper = 0.85*S, lower = 0.85*S;
                              const Lang = -0.6*step, Rang = 0.6*step; // opposite swing
                              const kneeLx = px-0.12*S + Math.sin(Lang)*upper*0.4;
                              const kneeLy = hipY + Math.cos(Lang)*upper;
                              const kneeRx = px+0.12*S + Math.sin(Rang)*upper*0.4;
                              const kneeRy = hipY + Math.cos(Rang)*upper;
                              const footLx = kneeLx + Math.sin(Lang)*lower*0.5;
                              const footLy = kneeLy + Math.cos(Lang)*lower;
                              const footRx = kneeRx + Math.sin(Rang)*lower*0.5;
                              const footRy = kneeRy + Math.cos(Rang)*lower;
                              ctx.strokeStyle = '#ffe0bd'; ctx.lineWidth = 4; ctx.lineCap = 'round';
                              // left leg
                              ctx.beginPath(); ctx.moveTo(px-0.12*S, hipY); ctx.lineTo(kneeLx, kneeLy); ctx.lineTo(footLx, footLy); ctx.stroke();
                              // right leg
                              ctx.beginPath(); ctx.moveTo(px+0.12*S, hipY); ctx.lineTo(kneeRx, kneeRy); ctx.lineTo(footRx, footRy); ctx.stroke();
                              // shoes
                              ctx.strokeStyle = '#334155'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(footLx-0.12*S, footLy+0.02*S); ctx.lineTo(footLx+0.12*S, footLy+0.02*S); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(footRx-0.12*S, footRy+0.02*S); ctx.lineTo(footRx+0.12*S, footRy+0.02*S); ctx.stroke();

                              // Arms swinging opposite legs
                              const armLen = 0.95*S;
                              const Larm = 0.7*step, Rarm = -0.7*step;
                              const handLx = px-0.4*S + Math.sin(Larm)*armLen*0.35;
                              const handLy = shoulderY + Math.cos(Larm)*armLen;
                              const handRx = px+0.4*S + Math.sin(Rarm)*armLen*0.35;
                              const handRy = shoulderY + Math.cos(Rarm)*armLen;
                              ctx.strokeStyle = '#ffe0bd'; ctx.lineWidth = 4; ctx.lineCap = 'round';
                              ctx.beginPath(); ctx.moveTo(px-0.45*S, shoulderY+0.1*S); ctx.lineTo(handLx, handLy); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(px+0.45*S, shoulderY+0.1*S); ctx.lineTo(handRx, handRy); ctx.stroke();

                              // Head (eyes + simple hair)
                              ctx.fillStyle = '#ffe0bd'; ctx.beginPath(); ctx.ellipse(px, headY, 0.55*S, 0.65*S, 0, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.ellipse(px-0.1*S, headY-0.4*S, 0.4*S, 0.25*S, -0.2, 0, Math.PI*2); ctx.fill();
                              // eyes
                              ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.ellipse(px-0.18*S, headY-0.05*S, 0.06*S, 0.08*S, 0, 0, Math.PI*2); ctx.fill();
                              ctx.beginPath(); ctx.ellipse(px+0.18*S, headY-0.05*S, 0.06*S, 0.08*S, 0, 0, Math.PI*2); ctx.fill();
                              // mouth
                              ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(px-0.12*S, headY+0.18*S); ctx.quadraticCurveTo(px, headY+0.24*S, px+0.12*S, headY+0.18*S); ctx.stroke();
                            };

                            // Walk in place with phase offsets for variety
                            for (let i=0;i<4;i++) drawPerson(xs[i], scales[i], colors[i], i*0.7);

                            // Growing slanted arrow from infant head to adult head
                            const S0 = Math.min(W,H)*0.07*scales[0];
                            const S3 = Math.min(W,H)*0.07*scales[3];
                            const startX = xs[0];
                            const startY = baseY - 3*S0 - 0.9*S0; // above infant head
                            const endX = xs[3];
                            const endY = baseY - 3*S3 - 0.9*S3;   // above adult head
                            // timeline with slight pause at end
                            const cyc = 4.6; const p = (time % cyc)/cyc; const ease = (x)=> x*x*(3-2*x);
                            const growEnd = 0.72, holdEnd = 0.9;
                            let k;
                            if (p < growEnd) k = ease(p/growEnd);
                            else if (p < holdEnd) k = 1; // pause
                            else k = ease(1-((p-holdEnd)/(1-holdEnd))); // retract
                            const hx = startX + (endX-startX)*k;
                            const hy = startY + (endY-startY)*k;
                            // arrow shaft
                            ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3.5; // green and thicker
                            ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(hx, hy); ctx.stroke();
                            // arrow head oriented with slope
                            if (k > 0.08){
                              const ang = Math.atan2(endY-startY, endX-startX);
                              const ah = 10;
                              ctx.fillStyle = '#22c55e';
                              ctx.beginPath();
                              ctx.moveTo(hx, hy);
                              ctx.lineTo(hx - Math.cos(ang-0.4)*ah, hy - Math.sin(ang-0.4)*ah);
                              ctx.lineTo(hx - Math.cos(ang+0.4)*ah, hy - Math.sin(ang+0.4)*ah);
                              ctx.closePath(); ctx.fill();
                            }

                            // 'Growth' at top center
                            ctx.fillStyle = 'rgba(0,0,0,0.7)';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.font = `${Math.max(14, (Math.min(W,H)*0.12|0))}px sans-serif`;
                            ctx.fillText('Growth', W*0.5, H*0.08);
                          };

                          const drawWater = (t)=>{
                            const W = width, H = height;
                            const time = t*0.001;

                            // Clear sky
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#69b7ff');
                            sky.addColorStop(1,'#cfefff');
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Check previous rain state to decide whether to show sun and vapors this frame
                            const wasRaining = rainTimer > 0;

                            // Sun warming the surface (hidden during rain)
                            if (!wasRaining){
                              const sunX = W*0.86, sunY = H*0.18, sunR = 10;
                              const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR*3);
                              glow.addColorStop(0,'rgba(255,244,128,0.9)'); glow.addColorStop(1,'rgba(255,244,128,0)');
                              ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sunX, sunY, sunR*3, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = '#fff59d'; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI*2); ctx.fill();
                            }

                            // Water body with subtle waves
                            const baseY = waterSurfaceY;
                            const waterGrad = ctx.createLinearGradient(0, baseY, 0, H);
                            waterGrad.addColorStop(0,'#4fc3f7');
                            waterGrad.addColorStop(1,'#0288d1');
                            ctx.fillStyle = waterGrad; ctx.fillRect(0, baseY, W, H-baseY);
                            // surface wave line
                            ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
                            ctx.beginPath();
                            for (let x=0;x<=W;x+=4){
                              const y = baseY + Math.sin(x*0.05 + time*2.0)*1.5;
                              if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                            }
                            ctx.stroke();

                            // Evaporation: vapor particles rise with drift
                            const cloudBase = H*0.35;
                            cloudAccum *= 0.985; // slow decay
                            if (!wasRaining){
                              for (let i=0;i<vapors.length;i++){
                                const v = vapors[i];
                                v.y -= 0.6*v.s;
                                v.x += Math.sin(time*1.8 + v.phase)*0.3 + 0.05; // slight drift right
                                // shimmer
                                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                                ctx.beginPath(); ctx.ellipse(v.x, v.y, 1.2*v.s, 1.2*v.s, 0, 0, Math.PI*2); ctx.fill();
                                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                                ctx.beginPath(); ctx.ellipse(v.x+0.8, v.y-0.6, 0.8*v.s, 0.8*v.s, 0, 0, Math.PI*2); ctx.fill();
                                // reached cloud base -> condense and reset
                                if (v.y < cloudBase){
                                  cloudAccum += 0.6*v.s;
                                  v.y = baseY + Math.random()*10;
                                  v.x = Math.random()*W;
                                  v.s = 0.6 + Math.random()*0.9;
                                  v.phase = Math.random()*Math.PI*2;
                                }
                              }
                            }

                            // Condensation: cloud grows and brightens
                            const cloudX = W*0.5;
                            const cloudY = cloudBase;
                            const size = 16 + Math.min(18, cloudAccum*1.2);
                            ctx.fillStyle = 'rgba(255,255,255,0.92)';
                            ctx.beginPath(); ctx.ellipse(cloudX, cloudY, size, size*0.6, 0, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.ellipse(cloudX- size*0.6, cloudY+4, size*0.7, size*0.45, 0, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.ellipse(cloudX+ size*0.6, cloudY+5, size*0.7, size*0.45, 0, 0, Math.PI*2); ctx.fill();
                            // soft cloud highlight
                            ctx.fillStyle = 'rgba(255,255,255,0.35)';
                            ctx.beginPath(); ctx.ellipse(cloudX-6, cloudY-4, size*0.5, size*0.3, 0, 0, Math.PI*2); ctx.fill();

                            // Trigger intermittent precipitation when cloud gets large
                            if (size > 28 && rainTimer <= 0){
                              rainTimer = 90; // shorter burst ~1.5 seconds at 60fps
                            }
                            const isRaining = rainTimer > 0;
                            if (isRaining){
                              rainTimer--;
                              cloudAccum *= 0.993; // cloud slowly releases moisture
                              // Spawn some drops near cloud
                              for (let s=0; s<6; s++){
                                rainDrops.push({
                                  x: cloudX + (Math.random()*2-1)*size*0.9,
                                  y: cloudY + 6,
                                  vy: 2 + Math.random()*1.5,
                                  len: 5 + Math.random()*3,
                                });
                              }
                            }
                            // Update and draw raindrops
                            ctx.strokeStyle = 'rgba(180,200,255,0.9)';
                            ctx.lineWidth = 1.1;
                            for (let i=rainDrops.length-1;i>=0;i--){
                              const d = rainDrops[i];
                              d.y += d.vy;
                              ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
                              if (d.y + d.len >= baseY){
                                // splash hint
                                ctx.strokeStyle = 'rgba(220,240,255,0.6)';
                                ctx.beginPath(); ctx.moveTo(d.x-2, baseY+1); ctx.lineTo(d.x+2, baseY+1); ctx.stroke();
                                // on hit, create a bit more vapor (re-evaporation kick)
                                cloudAccum *= 1.002;
                                rainDrops.splice(i,1);
                              }
                            }

                            // Arrows: show vapor going up when not raining; rotate down during rain
                            ctx.lineWidth = 1.2;
                            if (!isRaining){
                              // Upward vapor arrows from surface, angled slightly with drift
                              const arrowCount = 5;
                              for (let i=0;i<arrowCount;i++){
                                const ax = (i+0.5) * (W/arrowCount);
                                const ay = baseY + 4;
                                const angle = -Math.PI/2 + Math.sin(time*1.5 + i)*0.15; // mostly up with slight sway
                                const len = 20;
                                const x2 = ax + Math.cos(angle)*len;
                                const y2 = ay + Math.sin(angle)*len;
                                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x2, y2); ctx.stroke();
                                // arrowhead
                                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                                const ah = 5;
                                const leftA = angle + Math.PI*0.8;
                                const rightA = angle - Math.PI*0.8;
                                ctx.beginPath();
                                ctx.moveTo(x2, y2);
                                ctx.lineTo(x2 + Math.cos(leftA)*ah, y2 + Math.sin(leftA)*ah);
                                ctx.lineTo(x2 + Math.cos(rightA)*ah, y2 + Math.sin(rightA)*ah);
                                ctx.closePath(); ctx.fill();
                              }
                            } else {
                              // Downward precipitation arrows under the cloud during rain
                              const arrowCount = 4;
                              ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                              ctx.fillStyle = 'rgba(255,255,255,0.9)';
                              for (let i=0;i<arrowCount;i++){
                                const ax = cloudX + (i-(arrowCount-1)/2) * (size*0.5);
                                const ay = cloudY + 8;
                                const angle = Math.PI/2 + Math.sin(time*1.1 + i)*0.1; // mostly down
                                const len = (baseY - ay) - 8;
                                const x2 = ax + Math.cos(angle)*len;
                                const y2 = ay + Math.sin(angle)*len;
                                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x2, y2); ctx.stroke();
                                // arrowhead
                                const ah = 5;
                                const leftA = angle + Math.PI*0.8;
                                const rightA = angle - Math.PI*0.8;
                                ctx.beginPath();
                                ctx.moveTo(x2, y2);
                                ctx.lineTo(x2 + Math.cos(leftA)*ah, y2 + Math.sin(leftA)*ah);
                                ctx.lineTo(x2 + Math.cos(rightA)*ah, y2 + Math.sin(rightA)*ah);
                                ctx.closePath(); ctx.fill();
                              }
                            }
                          };

                          const drawSpace = (t)=>{
                            const W = width, H = height; const time = t*0.001;
                            // Deep space gradient background
                            const bg = ctx.createLinearGradient(0,0,0,H);
                            bg.addColorStop(0,'#060913'); bg.addColorStop(1,'#0e1430');
                            ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
                            // Stars with twinkle
                            for (let i=0;i<48;i++){
                              const sx = (i*97 + (time*40))%W; const sy = (i*51 + i*9)%H;
                              const tw = 0.5 + 0.5*Math.sin(time*3 + i*0.7);
                              const sz = (i%12===0)? 1.8 : 1.2;
                              ctx.globalAlpha = 0.5 + 0.5*tw; ctx.fillStyle = (i%9===0)? '#ffd59e' : '#e5f0ff';
                              ctx.fillRect(W - sx, sy, sz, sz);
                            }
                            ctx.globalAlpha = 1;

                            // Moon surface at bottom with craters
                            const groundY = H*0.86;
                            ctx.fillStyle = '#9aa3ad';
                            ctx.beginPath(); ctx.moveTo(0, groundY);
                            for (let x=0; x<=W; x+=8){
                              const y = groundY + Math.sin((x/W)*Math.PI*2)*4 + 6;
                              ctx.lineTo(x, y);
                            }
                            ctx.lineTo(W, H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
                            // craters
                            ctx.fillStyle = '#7b858f';
                            for (let c=0;c<5;c++){
                              const cxC = (c+1)*W/6 + Math.sin(time*0.7 + c)*6;
                              const cyC = groundY + 10 + (c%2? 6: -2);
                              ctx.beginPath(); ctx.ellipse(cxC, cyC, 16, 8, -0.2, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.ellipse(cxC+4, cyC+2, 10, 4, -0.2, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = '#7b858f';
                            }

                            // UFO (saucer) with alien under dome
                            const ufoX = W*0.32 + Math.sin(time*1.6)*6;
                            const ufoY = H*0.36 + Math.sin(time*2.0)*3;
                            const uS  = Math.min(W,H)*0.12;
                            // glow below UFO
                            ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#7dd3fc';
                            ctx.beginPath(); ctx.ellipse(ufoX, ufoY+uS*0.6, uS*0.9, uS*0.22, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
                            // saucer base
                            const baseGrad = ctx.createLinearGradient(ufoX-uS, ufoY, ufoX+uS, ufoY);
                            baseGrad.addColorStop(0,'#6b7280'); baseGrad.addColorStop(0.5,'#9ca3af'); baseGrad.addColorStop(1,'#6b7280');
                            ctx.fillStyle = baseGrad; ctx.beginPath(); ctx.ellipse(ufoX, ufoY, uS, uS*0.28, 0, 0, Math.PI*2); ctx.fill();
                            // lights on rim (purple/cyan)
                            for (let k=0;k<6;k++){
                              const ang = k*(Math.PI*2/6);
                              const lx = ufoX + Math.cos(ang)*uS*0.75;
                              const ly = ufoY + Math.sin(ang)*uS*0.21;
                              ctx.fillStyle = k%2? '#a78bfa':'#67e8f9';
                              ctx.beginPath(); ctx.ellipse(lx, ly, 3, 2, 0, 0, Math.PI*2); ctx.fill();
                            }
                            // glass dome
                            const domeG = ctx.createRadialGradient(ufoX-uS*0.1, ufoY-uS*0.35, 2, ufoX, ufoY-uS*0.35, uS*0.48);
                            domeG.addColorStop(0,'rgba(180,220,255,0.65)'); domeG.addColorStop(1,'rgba(180,220,255,0.1)');
                            ctx.fillStyle = domeG; ctx.beginPath(); ctx.ellipse(ufoX, ufoY-uS*0.16, uS*0.65, uS*0.45, 0, 0, Math.PI*2); ctx.fill();
                            // alien inside (purple skin)
                            ctx.fillStyle = '#a78bfa';
                            ctx.beginPath(); ctx.ellipse(ufoX, ufoY-uS*0.18, uS*0.18, uS*0.22, 0, 0, Math.PI*2); ctx.fill();
                            // eyes
                            ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.ellipse(ufoX-uS*0.06, ufoY-uS*0.20, uS*0.05, uS*0.07, -0.2, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.ellipse(ufoX+uS*0.06, ufoY-uS*0.20, uS*0.05, uS*0.07, 0.2, 0, Math.PI*2); ctx.fill();
                            // waving arm
                            const wave = Math.sin(time*3.0)*0.25;
                            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3; ctx.lineCap='round';
                            ctx.beginPath(); ctx.moveTo(ufoX+uS*0.10, ufoY-uS*0.15); ctx.lineTo(ufoX+uS*(0.22+0.04*wave), ufoY-uS*(0.22-0.03*wave)); ctx.stroke();

                            // Abduction beam toggle (on/off loop) and lifting rock
                            const cyc = 3.0; const pp = (time % cyc)/cyc; const beamOn = (pp > 0.25 && pp < 0.75);
                            const rockX = ufoX; const rockBaseY = groundY + 4;
                            let rockLift = 0;
                            if (beamOn){
                              const beamTopX = ufoX, beamTopY = ufoY + uS*0.05;
                              const beamBottomY = groundY + 8; const halfW = uS*0.55*0.5;
                              const grad = ctx.createLinearGradient(beamTopX, beamTopY, beamTopX, beamBottomY);
                              grad.addColorStop(0,'rgba(125, 211, 252, 0.45)');
                              grad.addColorStop(1,'rgba(125, 211, 252, 0.06)');
                              ctx.fillStyle = grad;
                              ctx.beginPath();
                              ctx.moveTo(beamTopX - uS*0.12, beamTopY);
                              ctx.lineTo(beamTopX + uS*0.12, beamTopY);
                              ctx.lineTo(beamTopX + halfW, beamBottomY);
                              ctx.lineTo(beamTopX - halfW, beamBottomY);
                              ctx.closePath(); ctx.fill();
                              rockLift = Math.sin((pp-0.25)/(0.5)*Math.PI) * 10; // ease up then down
                            }
                            // rock
                            ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.ellipse(rockX, rockBaseY - rockLift, 8, 5, 0.2, 0, Math.PI*2); ctx.fill();

                            // Astronaut floating with tether
                            const ax = W*0.68 + Math.sin(time*1.1)*10;
                            const ay = H*0.38 + Math.sin(time*1.7+1.2)*6;
                            const aS = Math.min(W,H)*0.10;
                            // tether to right edge
                            ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax+aS*0.1, ay); ctx.bezierCurveTo(W*0.88, ay-12, W*0.92, ay+8, W-6, ay-4); ctx.stroke();
                            // body
                            ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.roundRect(ax-aS*0.20, ay-aS*0.06, aS*0.40, aS*0.52, 6); ctx.fill();
                            // helmet
                            ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.ellipse(ax, ay-aS*0.18, aS*0.20, aS*0.22, 0, 0, Math.PI*2); ctx.fill();
                            const visor = ctx.createLinearGradient(ax-aS*0.18, ay-aS*0.28, ax+aS*0.18, ay-aS*0.10);
                            visor.addColorStop(0,'#0b1220'); visor.addColorStop(1,'#1f2937');
                            ctx.fillStyle = visor; ctx.beginPath(); ctx.ellipse(ax, ay-aS*0.18, aS*0.16, aS*0.14, 0, 0, Math.PI*2); ctx.fill();
                            // arms (make right arm wave slightly)
                            ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax-aS*0.20, ay+aS*0.02); ctx.lineTo(ax-aS*0.36, ay-aS*0.10); ctx.stroke();
                            const waveR = Math.sin(time*2.4)*0.08;
                            ctx.beginPath(); ctx.moveTo(ax+aS*0.20, ay+aS*0.02); ctx.lineTo(ax+aS*(0.36), ay-aS*(0.02+waveR)); ctx.stroke();
                            // legs
                            ctx.beginPath(); ctx.moveTo(ax-aS*0.12, ay+aS*0.46); ctx.lineTo(ax-aS*0.16, ay+aS*0.70); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(ax+aS*0.12, ay+aS*0.46); ctx.lineTo(ax+aS*0.16, ay+aS*0.70); ctx.stroke();
                            // backpack
                            ctx.fillStyle = '#cbd5e1'; ctx.fillRect(ax-aS*0.10, ay+aS*0.05, aS*0.20, aS*0.16);
                            // small waving flag on backpack
                            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax+aS*0.10, ay+aS*0.08); ctx.lineTo(ax+aS*0.18, ay+aS*0.02); ctx.stroke();
                            ctx.fillStyle = '#60a5fa'; ctx.beginPath(); ctx.moveTo(ax+aS*0.18, ay+aS*0.02); ctx.lineTo(ax+aS*0.24, ay+aS*0.04); ctx.lineTo(ax+aS*0.18, ay+aS*0.06); ctx.closePath(); ctx.fill();
                          };

                          const drawHeartbeat = (t)=>{
                            // Static scene: child standing on the left, no animation
                            const W = width, H = height;
                            ctx.clearRect(0,0,W,H);

                            // Background (soft yellow)
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#fff9c4'); // light yellow top
                            sky.addColorStop(1,'#fffde7'); // near-white yellow bottom
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Ground line
                            const groundY = Math.min(H-4, H*0.9);
                            ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(10, groundY); ctx.lineTo(W-10, groundY); ctx.stroke();

                            // Child at left
                            const cx = Math.max(22, W*0.18);
                            const S = Math.min(W,H)*0.24; // overall scale (taller child)
                            // shadow
                            ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#000';
                            ctx.beginPath(); ctx.ellipse(cx, groundY+2, S*0.9, S*0.18, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
                            // body
                            ctx.fillStyle = '#60a5fa';
                            ctx.beginPath(); ctx.roundRect(cx-S*0.22, groundY-S*0.75, S*0.44, S*0.46, 6); ctx.fill();
                            // head
                            ctx.fillStyle = '#ffdeb5';
                            ctx.beginPath(); ctx.ellipse(cx, groundY-S*0.92, S*0.18, S*0.22, 0, 0, Math.PI*2); ctx.fill();
                            // hair
                            ctx.fillStyle = '#3b2f2a';
                            ctx.beginPath(); ctx.ellipse(cx-2, groundY-S*0.99, S*0.20, S*0.10, -0.2, 0, Math.PI*2); ctx.fill();
                            // eyes
                            ctx.fillStyle = '#1f2937';
                            ctx.beginPath(); ctx.arc(cx-S*0.06, groundY-S*0.94, S*0.02, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.arc(cx+S*0.06, groundY-S*0.94, S*0.02, 0, Math.PI*2); ctx.fill();
                            // smile
                            ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 1.2;
                            ctx.beginPath(); ctx.arc(cx, groundY-S*0.90, S*0.06, 0, Math.PI); ctx.stroke();
                            // arms (relaxed)
                            ctx.strokeStyle = '#ffdeb5'; ctx.lineWidth = 3; ctx.lineCap = 'round';
                            ctx.beginPath(); ctx.moveTo(cx-S*0.22, groundY-S*0.64); ctx.lineTo(cx-S*0.38, groundY-S*0.50); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx+S*0.22, groundY-S*0.64); ctx.lineTo(cx+S*0.38, groundY-S*0.50); ctx.stroke();
                            // legs
                            ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.lineCap='round';
                            ctx.beginPath(); ctx.moveTo(cx-S*0.10, groundY-S*0.29); ctx.lineTo(cx-S*0.12, groundY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx+S*0.10, groundY-S*0.29); ctx.lineTo(cx+S*0.12, groundY); ctx.stroke();

                            // Optional: small heart icon near torso to hint "human body" topic, static
                            ctx.fillStyle = '#ef4444';
                            ctx.beginPath();
                            const hx = cx, hy = groundY - S*0.60, r = S*0.03;
                            ctx.moveTo(hx, hy);
                            ctx.arc(hx-r, hy, r, 0, Math.PI, true);
                            ctx.arc(hx+r, hy, r, 0, Math.PI, true);
                            ctx.lineTo(hx, hy + r*1.8);
                            ctx.closePath(); ctx.fill();
                          };

                          const drawPlant = (t)=>{
                            // Leaf veins
                            ctx.strokeStyle = makeGrad(0,height,width,0,[palettes.plant[0], palettes.plant[1]]); ctx.lineWidth = 1.2;
                            ctx.beginPath(); ctx.moveTo(20, height-20); ctx.quadraticCurveTo(width*0.5, height*0.2, width-20, height-20); ctx.stroke();
                            for (let i=1;i<6;i++){
                              ctx.beginPath();
                              const px = 20 + i*(width-40)/6;
                              const py = height-20;
                              ctx.moveTo(px, py);
                              ctx.quadraticCurveTo(px, py-12, px+8, py-6);
                              ctx.stroke();
                            }
                          };

                          const drawAnimal = (t)=>{
                            // Paw prints moving
                            const step = (t*0.05)%40;
                            const cols = palettes.animal;
                            for (let i=0;i<4;i++){
                              const x = 20 + i*40 + step;
                              const y = height*0.65 + ((i%2)?-4:4);
                              ctx.fillStyle = pick(cols,i);
                              ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = pick(cols,i+1);
                              ctx.beginPath(); ctx.arc(x-5, y-4, 1.2, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = pick(cols,i+2);
                              ctx.beginPath(); ctx.arc(x+5, y-4, 1.2, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = pick(cols,i+3);
                              ctx.beginPath(); ctx.arc(x-3, y-6, 1.2, 0, Math.PI*2); ctx.fill();
                              ctx.fillStyle = pick(cols,i+4);
                              ctx.beginPath(); ctx.arc(x+3, y-6, 1.2, 0, Math.PI*2); ctx.fill();
                            }
                          };

                          const drawEnvironment = (t)=>{
                            // Climate scene: central globe, fire beneath, factories on both sides with smoke
                            const W = width, H = height; const time = t*0.001;
                            ctx.clearRect(0,0,W,H);
                            // Background sky (smoggy)
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#cfd8dc'); sky.addColorStop(1,'#eceff1');
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Ground/industrial base
                            const baseY = Math.min(H-8, H*0.82);
                            ctx.fillStyle = '#b0bec5'; ctx.fillRect(0, baseY, W, H-baseY);

                            // Globe in center (rotating continents)
                            const gx = W*0.5, gy = baseY-20; const R = Math.min(W,H)*0.26; // bigger globe
                            const rot = time*0.5;
                            const drawGlobe = (S)=>{
                              // ocean
                              const ocean = ctx.createRadialGradient(gx-S*0.2, gy-S*0.2, S*0.1, gx, gy, S);
                              ocean.addColorStop(0,'#2a9df4'); ocean.addColorStop(1,'#0b5fb3');
                              ctx.fillStyle = ocean; ctx.beginPath(); ctx.arc(gx, gy, S, 0, Math.PI*2); ctx.fill();
                              // clip
                              ctx.save(); ctx.beginPath(); ctx.arc(gx, gy, S, 0, Math.PI*2); ctx.clip();
                              // continents (simple rotated ellipses)
                              ctx.save(); ctx.translate(gx, gy); ctx.rotate(rot); ctx.fillStyle = '#2fb56e';
                              const land = (x,y,rx,ry)=>{ ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fill(); };
                              land(-S*0.35, -S*0.05, S*0.28, S*0.16);
                              land(S*0.15,  S*0.02, S*0.22, S*0.12);
                              land(S*0.05, -S*0.24, S*0.12, S*0.08);
                              // more islands/continents for richness
                              ctx.fillStyle = '#33c073'; land(-S*0.10,  S*0.20, S*0.12, S*0.07);
                              ctx.fillStyle = '#279f61'; land(S*0.28,  -S*0.10, S*0.10, S*0.06);
                              ctx.fillStyle = '#2fb56e'; land(-S*0.30,  S*0.08, S*0.09, S*0.05);
                              ctx.fillStyle = '#33c073'; land( S*0.00,  S*0.26, S*0.08, S*0.05);
                              ctx.restore();
                              // rim highlight
                              const rim = ctx.createRadialGradient(gx-S*0.2, gy-S*0.2, S*0.3, gx, gy, S);
                              rim.addColorStop(0,'rgba(255,255,255,0.10)'); rim.addColorStop(1,'rgba(255,255,255,0)');
                              ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(gx, gy, S, 0, Math.PI*2); ctx.fill();
                              ctx.restore();
                            };
                            drawGlobe(R);

                            // Fire directly beneath the globe (more realistic: taller, brighter core, glow, alternating big/short)
                            const flameY = gy + R - 1; // touch globe bottom
                            const flames = 14;
                            for (let i=0;i<flames;i++){
                              const tnorm = i/(flames-1);
                              const fx = gx - R*0.68 + tnorm*R*1.36; // evenly span under globe
                              // Alternate big/short with time-swapping
                              const swap = (Math.sin(time*2.2) > 0) ? 1 : 0;
                              const alt = (((i + swap) % 2) === 0) ? 1.35 : 0.7;
                              const flicker = 1 + 0.22*Math.sin(time*7 + i*0.6);
                              const h = 22 * alt * flicker; // taller
                              const baseW = 8 * (0.85 + 0.15*Math.sin(time*3 + i));
                              // Outer flame gradient
                              const grad = ctx.createLinearGradient(fx, flameY, fx, flameY + h);
                              grad.addColorStop(0,'#fff7c2');
                              grad.addColorStop(0.35,'#ffd166');
                              grad.addColorStop(0.7,'#f59e0b');
                              grad.addColorStop(1,'#ef4444');
                              ctx.fillStyle = grad;
                              ctx.beginPath(); ctx.moveTo(fx, flameY);
                              ctx.bezierCurveTo(fx-baseW*0.6, flameY + h*0.35, fx-baseW*0.4, flameY + h*0.72, fx, flameY + h);
                              ctx.bezierCurveTo(fx+baseW*0.4, flameY + h*0.72, fx+baseW*0.6, flameY + h*0.35, fx, flameY);
                              ctx.fill();
                              // Inner bright core
                              const coreH = h*0.7; const coreW = baseW*0.45;
                              const core = ctx.createLinearGradient(fx, flameY, fx, flameY + coreH);
                              core.addColorStop(0,'#ffffff'); core.addColorStop(1,'rgba(255,200,80,0)');
                              ctx.fillStyle = core;
                              ctx.beginPath(); ctx.moveTo(fx, flameY);
                              ctx.bezierCurveTo(fx-coreW*0.5, flameY + coreH*0.35, fx-coreW*0.3, flameY + coreH*0.72, fx, flameY + coreH);
                              ctx.bezierCurveTo(fx+coreW*0.3, flameY + coreH*0.72, fx+coreW*0.5, flameY + coreH*0.35, fx, flameY);
                              ctx.fill();
                              // Flame glow
                              ctx.save();
                              ctx.globalAlpha = 0.18;
                              ctx.fillStyle = '#ffb74d';
                              ctx.beginPath(); ctx.ellipse(fx, flameY + h*0.5, baseW*0.9, h*0.55, 0.1, 0, Math.PI*2); ctx.fill();
                              ctx.restore();
                            }

                            // Factory drawing helper (bigger, detailed)
                            const drawFactory = (bx, by, flip=false)=>{
                              const dir = flip? -1: 1; const Wf = Math.min(W, H)*0.24; const Hf = Math.min(W,H)*0.24; // larger
                              // base building body
                              ctx.fillStyle = '#90a4ae'; ctx.fillRect(bx, by-Hf*0.6, Wf, Hf*0.6);
                              // roof line
                              ctx.strokeStyle = '#78909c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by-Hf*0.6); ctx.lineTo(bx+Wf, by-Hf*0.6); ctx.stroke();
                              // windows grid (more)
                              ctx.fillStyle = '#e0f2f1';
                              for (let r=0; r<3; r++){
                                for (let c=0; c<5; c++){
                                  const wx = bx+8 + c*(Wf-24)/4;
                                  const wy = by-Hf*0.5 + r*12;
                                  ctx.fillRect(wx, wy, 10, 6);
                                }
                              }
                              // side pipes
                              ctx.strokeStyle = '#607d8b'; ctx.lineWidth = 4; ctx.lineCap='round';
                              ctx.beginPath();
                              const px1 = flip? (bx+Wf-6) : (bx+6);
                              ctx.moveTo(px1, by-Hf*0.2); ctx.lineTo(px1, by-Hf*0.45); ctx.lineTo(px1 + dir*18, by-Hf*0.45); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(px1, by-Hf*0.1); ctx.lineTo(px1, by-Hf*0.32); ctx.lineTo(px1 + dir*14, by-Hf*0.32); ctx.stroke();
                              // warning lights on roof
                              for (let i=0;i<3;i++){
                                const lx = bx + Wf*(0.2 + i*0.3); const ly = by-Hf*0.62;
                                const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 8);
                                glow.addColorStop(0,'rgba(255, 99, 71, 0.9)'); glow.addColorStop(1,'rgba(255, 99, 71, 0)');
                                ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly, 8, 0, Math.PI*2); ctx.fill();
                                ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI*2); ctx.fill();
                              }
                              // tall chimney (longer, taller)
                              const cxm = bx + (flip? Wf-16: 16);
                              ctx.fillStyle = '#78909c'; ctx.fillRect(cxm-7, by-Hf*1.0, 14, Hf*1.0);
                              // denser, darker smoke puffs rising with visible looping
                              for (let k=0;k<8;k++){
                                const tsm = (time*0.6 + k*0.12) % 1; // 0..1 slow rise
                                const sy = (by - Hf*1.0) - tsm * Math.min(H*0.55, 140); // limit rise height
                                const drift = Math.sin(time*0.8 + k)*6 * (flip? -1:1);
                                const sx = cxm + drift;
                                const a = Math.max(0, 0.75 * (1 - tsm));
                                const rx = 14 - k*0.8; const ry = 9 - k*0.6;
                                ctx.fillStyle = `rgba(90, 95, 100, ${a})`;
                                ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0.15, 0, Math.PI*2); ctx.fill();
                              }
                            };
                            // Left and right factories with equal spacing from globe
                            const facW = Math.min(W,H)*0.24;
                            const gap = R*0.6; // equal gap from globe edge to factory body
                            const leftX = Math.max(6, gx - (R + gap + facW));
                            const rightX = Math.min(W - 6 - facW, gx + R + gap);
                            drawFactory(leftX, baseY, false);
                            drawFactory(rightX, baseY, true);
                          };

                          // Custom: Farmer harvesting crops (for "Crop Production and Management")
                          const drawFarmerHarvest = (t)=>{
                            // Realistic-style tiny diorama: bright sky with sun & clouds, distant hills, crop rows, farmer cutting with serpentine path
                            const W = width, H = height;
                            const time = t * 0.001;
                            const wind = Math.sin(time*1.3) * 0.6;

                            // Background sky (daytime) – brighter and richer gradient
                            const sky = ctx.createLinearGradient(0,0,0,H);
                            sky.addColorStop(0,'#4aa3ff');   // vivid top blue
                            sky.addColorStop(0.55,'#79c6ff'); // mid
                            sky.addColorStop(1,'#dff6ff');    // near horizon
                            ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

                            // Sun with soft glow
                            const sunX = W*0.12, sunY = H*0.18, sunR = 12;
                            const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR*3);
                            sunGlow.addColorStop(0, 'rgba(255, 241, 118, 0.9)');
                            sunGlow.addColorStop(1, 'rgba(255, 241, 118, 0)');
                            ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(sunX, sunY, sunR*3, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = '#fff59d'; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI*2); ctx.fill();

                            // Soft sun rays
                            ctx.save();
                            ctx.translate(sunX, sunY);
                            for (let i=0;i<12;i++){
                              ctx.rotate(Math.PI*2/12);
                              const g = ctx.createLinearGradient(0,0,30,0);
                              g.addColorStop(0,'rgba(255,241,118,0.35)');
                              g.addColorStop(1,'rgba(255,241,118,0)');
                              ctx.fillStyle = g;
                              ctx.fillRect(0,-1,30,2);
                            }
                            ctx.restore();

                            // Clouds drifting
                            const cloud = (cx, cy, s)=>{
                              ctx.fillStyle = 'rgba(255,255,255,0.9)';
                              ctx.beginPath(); ctx.arc(cx, cy, 6*s, 0, Math.PI*2);
                              ctx.arc(cx+6*s, cy-2*s, 5*s, 0, Math.PI*2);
                              ctx.arc(cx+12*s, cy, 6*s, 0, Math.PI*2); ctx.fill();
                            };
                            const c1x = (time*12) % (W+40) - 20; cloud(c1x, H*0.18, 1);
                            const c2x = (time*8 + 60) % (W+40) - 20; cloud(c2x, H*0.26, 0.9);
                            const c3x = (time*10 + 130) % (W+40) - 20; cloud(c3x, H*0.14, 0.8);

                            // Horizon haze
                            const haze = ctx.createLinearGradient(0, H*0.55, 0, H*0.75);
                            haze.addColorStop(0,'rgba(255,255,255,0.22)');
                            haze.addColorStop(1,'rgba(255,255,255,0)');
                            ctx.fillStyle = haze; ctx.fillRect(0, H*0.55, W, H*0.2);

                            // Distant hills silhouette (bluish to avoid green tint)
                            ctx.fillStyle = 'rgba(70, 100, 160, 0.55)';
                            ctx.beginPath();
                            ctx.moveTo(0, H*0.55);
                            for (let x=0; x<=W; x+=6){
                              const y = H*0.56 + Math.sin(x*0.02 + time*0.4)*2 + Math.cos(x*0.04 + 1)*1.2;
                              ctx.lineTo(x, y);
                            }
                            ctx.lineTo(W,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();

                            // Field parameters (perspective)
                            const rows = 7, cols = 12;
                            const horizonY = H*0.62;
                            const rowGap = 7; // vertical spacing per row
                            const baseTile = Math.min(16, W/cols);
                            const tileWAtRow = (r)=> baseTile * (1 + (rows-r-1)*0.05); // closer rows slightly wider

                            // Build serpentine path order (r alternates direction)
                            const path = [];
                            for (let r=0; r<rows; r++){
                              const seq = [...Array(cols).keys()];
                              const list = (r%2===0) ? seq : seq.reverse();
                              for (const c of list) path.push({r, c});
                            }

                            // Progress along cutting path
                            const total = path.length;
                            // Slower pace: reduce tile advancement per second further
                            const speed = 0.08; // tiles per frame unit (paired with *30 below)
                            const cutCount = Math.min(total, Math.floor((time*speed*30) % (total+cols)));
                            const farmerIndex = Math.min(cutCount, total-1);
                            const { r: fr, c: fc } = path[farmerIndex];

                            // Helpers
                            const isoTile = (cx, cy, w, h, color)=>{
                              ctx.fillStyle = color;
                              ctx.beginPath();
                              ctx.moveTo(cx, cy-h);
                              ctx.lineTo(cx+w*0.5, cy);
                              ctx.lineTo(cx, cy+h);
                              ctx.lineTo(cx-w*0.5, cy);
                              ctx.closePath();
                              ctx.fill();
                            };
                            const drawStalks = (cx, cy, density, len, swayAmp, light)=>{
                              for (let i=0;i<density;i++){
                                const off = (i/density - 0.5) * baseTile * 0.6;
                                const sway = Math.sin(time*2 + i*0.9) * swayAmp + wind*0.4;
                                ctx.strokeStyle = light ? '#d7f4a3' : '#b5e07a';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(cx+off*0.6, cy);
                                ctx.quadraticCurveTo(cx+off*0.6 + sway*2, cy-len*0.6, cx+off*0.6 + sway*4, cy-len);
                                ctx.stroke();
                              }
                            };

                            // Draw field rows, with harvested tiles showing stubble and soil
                            let idx = 0;
                            for (let r=0; r<rows; r++){
                              const y = horizonY + r*rowGap;
                              const tileW = tileWAtRow(r);
                              const tileH = 6 + r*0.2; // slight scale toward viewer
                              const rowWidth = cols*tileW;
                              const startX = (W*0.5 - rowWidth*0.5) + (r%2? tileW*0.5: 0);

                              for (let c=0; c<cols; c++){
                                const cx = startX + c*tileW;
                                const inPath = idx < cutCount;
                                // Soil base
                                isoTile(cx, y+2, tileW, tileH, '#6f4d33');
                                if (inPath){
                                  // Stubble (short cut stems) + lighter soil highlight
                                  isoTile(cx, y, tileW*0.96, tileH*0.8, '#8b5e3c');
                                  drawStalks(cx, y-1, 4, 5, 0.3, false);
                                } else {
                                  // Tall crops with shading
                                  isoTile(cx, y, tileW*0.96, tileH*0.9, '#2e7d32');
                                  // highlight ridge
                                  isoTile(cx, y-1, tileW*0.86, tileH*0.7, '#3fa74a');
                                  drawStalks(cx, y-2, 6, 9, 0.6, true);
                                }
                                idx++;
                              }
                            }

                            // Farmer world position
                            const fy = horizonY + fr*rowGap;
                            const fTileW = tileWAtRow(fr);
                            const rowWidth = cols*fTileW;
                            const fx = (W*0.5 - rowWidth*0.5) + (fr%2? fTileW*0.5: 0) + fc*fTileW;

                            // Shadow (slightly larger due to larger farmer)
                            ctx.save();
                            ctx.globalAlpha = 0.25;
                            ctx.fillStyle = '#000';
                            ctx.beginPath();
                            ctx.ellipse(fx, fy-6, 10, 5, 0, 0, Math.PI*2);
                            ctx.fill();
                            ctx.restore();

                            // Farmer with limb and tool motion (slightly bigger)
                            ctx.save();
                            ctx.translate(fx, fy-14);
                            const step = Math.sin(time*5);
                            const torsoTilt = step*0.05;
                            ctx.rotate(torsoTilt);
                            // torso
                            ctx.fillStyle = '#2d9cdb';
                            ctx.fillRect(-4, -10, 8, 14);
                            // head
                            ctx.fillStyle = '#f1c27d';
                            ctx.beginPath(); ctx.arc(0, -16, 5, 0, Math.PI*2); ctx.fill();
                            // hat brim
                            ctx.fillStyle = '#8d5524';
                            ctx.fillRect(-6, -19, 12, 2);
                            // arms (simple swinging)
                            ctx.strokeStyle = '#f1c27d'; ctx.lineWidth = 2.0;
                            ctx.beginPath(); ctx.moveTo(-3, -7); ctx.lineTo(-9, -7 + step*2); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(3, -7); ctx.lineTo(10, -8 - step*2); ctx.stroke();
                            // tool (sickle) on right hand
                            ctx.save();
                            ctx.translate(11, -8 - step*2);
                            ctx.rotate(-0.9 + Math.sin(time*6)*0.3);
                            ctx.strokeStyle = '#cdd6f4'; ctx.lineWidth = 2.0;
                            ctx.beginPath(); ctx.arc(0, 0, 8, -1.2, 0.6); ctx.stroke();
                            ctx.restore();
                            // legs
                            ctx.strokeStyle = '#2f2f2f'; ctx.lineWidth = 2.2;
                            ctx.beginPath(); ctx.moveTo(-1, 2); ctx.lineTo(-4, 8 + Math.max(0, -step*2)); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(1, 2); ctx.lineTo(4, 8 + Math.max(0, step*2)); ctx.stroke();
                            ctx.restore();

                            // Cutting particles (chaff) near blade
                            ctx.save();
                            const px = fx + 11, py = fy - 18;
                            for (let i=0;i<6;i++){
                              const a = time*6 + i;
                              const dx = Math.cos(a)* (2+i*0.3);
                              const dy = Math.sin(a)* (1+i*0.2);
                              ctx.fillStyle = 'rgba(223, 255, 172, 0.8)';
                              ctx.fillRect(px+dx, py+dy, 1, 1);
                            }
                            ctx.restore();
                          };

                          const loop = (now)=>{
                            const dt = now - t0; t0 = now;
                            // clear with transparency
                            ctx.clearRect(0,0,width,height);
                            // pick animation
                            const titleLower = title.toLowerCase();
                            const categoryLower = category.toLowerCase();
                            if (titleLower.includes('animal kingdom')) drawAnimalHug(now);
                            else if (titleLower.includes('plant life')) drawPlantGrowth(now);
                            else if (titleLower.includes('crop') || titleLower.includes('production')) drawFarmerHarvest(now);
                            else if (titleLower.includes('forces') || titleLower.includes('motion')) drawForcesMotion(now);
                            else if (titleLower.includes('electricity')) drawElectricity(now);
                            else if (titleLower.includes('light') || titleLower.includes('sound')) drawLightSound(now);
                            else if (titleLower.includes('water')) drawWater(now);
                            else if (titleLower.includes('space')) drawSpace(now);
                            else if (titleLower.includes('human') || titleLower.includes('body') || titleLower.includes('skeleton')) drawHeartbeat(now);
                            else if (titleLower.includes('plant')) drawPlant(now);
                            else if (titleLower.includes('animal')) drawAnimal(now);
                            else if (titleLower.includes('environment')) drawEnvironment(now);
                            else if (titleLower.includes('earth science')) drawEarthScience(now);
                            else if (titleLower.includes('earth')) drawEarth(now);
                            else if (titleLower.includes('reaching the age of adolescence')) drawAdolescence(now);
                            else if (categoryLower.includes('physics')) drawPhysics(now);
                            else if (categoryLower.includes('biology')) drawBiology(now);
                            else if (categoryLower.includes('earth')) drawEarth(now);
                            else if (categoryLower.includes('chem')) drawChemistry(now);
                            else drawEarth(now);
                            rid = requestAnimationFrame(loop);
                            canvas.dataset.rid = String(rid);
                          };
                          rid = requestAnimationFrame(loop);
                          // Best‑effort cleanup if ever re-rendered
                          canvas.addEventListener('destroy', ()=>{ try{ cancelAnimationFrame(rid);}catch{} }, { once:true });
                        }
                      }}
                    ></canvas>
                    <div className="thumbnail-overlay">
                      {isAvailable ? (
                        <span className="available-badge premium-badge">✅</span>
                      ) : (
                        <span className="locked-badge premium-badge">🔒</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="premium-card-body">
                    <h3 className="chapter-title premium-title">{chapter.title}</h3>
                    <div className="chapter-actions premium-actions">
                      {isAvailable ? (
                        <>
                          <Link to={chapter.link} className="premium-btn">
                            🚀 Start Adventure
                          </Link>
                          <a
                            href={chapter.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="premium-btn-secondary"
                          >
                            👁 Peek Inside
                          </a>
                        </>
                      ) : (
                        <>
                          <button className="premium-btn-locked" disabled>
                            🔒 Coming Soon
                          </button>
                          <a
                            href={chapter.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="premium-btn-secondary"
                          >
                            👁 Peek Inside
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover particles removed for calmer UI */}

              {/* Glow Effect */}
              <div className="premium-glow-effect"></div>
            </div>
          );
        })}
      </div>

      <div className="fun-footer">
        <div className="footer-content">
          <span className="footer-text">
            Ready to become a Science Superstar? You are in the correct Place..
          </span>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #1a0b2e !important; margin: 0; padding: 0; height: 100%; overflow-x: hidden; }
        .sal-root {
          min-height: 100vh;
          height: 100vh;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          overflow-y: auto;
          overflow-x: hidden;
          background: #1a0b2e;
          padding: 20px;
          font-family: 'Fredoka One', 'Comic Sans MS', cursive, sans-serif;
          box-sizing: border-box;
        }
        /* Premium Background Effects */
        .premium-bg-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%); animation: breathe 4s ease-in-out infinite; }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.6; } }
        .particle-system { position: absolute; width: 100%; height: 100%; overflow: hidden; }
        .bg-particle { position: absolute; width: 2px; height: 2px; background: linear-gradient(45deg, #d946ef, #7c3aed); border-radius: 50%; animation: floatUp linear infinite; }
        @keyframes floatUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100px) scale(1); opacity: 0; } }
        .grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px); background-size: 50px 50px; animation: gridMove 20s linear infinite; opacity: 0.3; }
        @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        .sparkle, .premium-sparkle { position: absolute; background: radial-gradient(circle, rgba(217, 70, 239, 0.9) 0%, rgba(124, 58, 237, 0.6) 50%, transparent 70%); border-radius: 50%; animation: premiumSparkle 3s ease-in-out infinite; pointer-events: none; box-shadow: 0 0 20px rgba(217, 70, 239, 0.8); }
        @keyframes premiumSparkle { 0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); } 50% { opacity: 1; transform: scale(1) rotate(180deg); } }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
        .background-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .bg-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) saturate(1.1); }
        .floating-shapes { position: absolute; width: 100%; height: 100%; }
        .shape, .premium-shape { position: absolute; font-size: 2rem; animation: premiumFloat 6s ease-in-out infinite; opacity: 0.8; filter: drop-shadow(0 0 10px rgba(217, 70, 239, 0.6)); transition: all 0.3s ease; }
        .premium-shape:hover { transform: scale(1.2) rotate(15deg); filter: drop-shadow(0 0 20px rgba(217, 70, 239, 1)); }
        @keyframes premiumFloat { 0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); } 33% { transform: translateY(-15px) rotate(5deg) scale(1.05); } 66% { transform: translateY(-5px) rotate(-5deg) scale(0.95); } }
        .shape-1 { top: 10%; left: 10%; animation-delay: 0s; } .shape-2 { top: 20%; right: 15%; animation-delay: 1s; } .shape-3 { top: 60%; left: 5%; animation-delay: 2s; } .shape-4 { top: 70%; right: 10%; animation-delay: 3s; } .shape-5 { top: 30%; left: 80%; animation-delay: 4s; } .shape-6 { top: 80%; left: 70%; animation-delay: 5s; } .shape-7 { top: 40%; right: 40%; animation-delay: 2.5s; } .shape-8 { top: 90%; left: 40%; animation-delay: 1.5s; } .shape-9 { top: 15%; left: 75%; animation-delay: 3.5s; } .shape-10 { top: 85%; right: 20%; animation-delay: 4.5s; } .shape-11 { top: 45%; left: 25%; animation-delay: 5.5s; } .shape-12 { top: 25%; right: 60%; animation-delay: 6s; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
        /* Premium Title Effects */
        .header, .premium-header { text-align: center; margin-bottom: 25px; position: relative; z-index: 1; }
        .title-container, .premium-title-container { position: relative; display: inline-block; }
        .title-glow-effect { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120%; height: 120%; background: radial-gradient(ellipse, rgba(217, 70, 239, 0.3) 0%, transparent 70%); border-radius: 50%; animation: titleGlow 3s ease-in-out infinite; }
        @keyframes titleGlow { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; } }
        .title-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .title-particle { position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, #d946ef, #7c3aed); border-radius: 50%; animation: titleParticleFloat 2s ease-in-out infinite; }
        @keyframes titleParticleFloat { 0% { transform: translateY(0) scale(0); opacity: 0; } 50% { transform: translateY(-20px) scale(1); opacity: 1; } 100% { transform: translateY(-40px) scale(0); opacity: 0; } }
        .main-title, .premium-title {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          text-shadow: 4px 4px 8px rgba(0,0,0,0.3), 0 0 30px rgba(217, 70, 239, 0.8);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          /* New bordered glass look */
          padding: 12px 22px;
          border-radius: 18px;
          /* No solid border — glow-only style */
          border: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          backdrop-filter: blur(8px) saturate(140%);
          -webkit-backdrop-filter: blur(8px) saturate(140%);
          box-shadow: 0 8px 28px rgba(124,58,237,0.45), inset 0 0 0 1px rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        /* Soft animated gradient border glow */
        .main-title::before, .premium-title::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(217,70,239,0.5), rgba(168,85,247,0.5));
          z-index: -1;
          filter: blur(22px);
          animation: titleBorderGlow 4s ease-in-out infinite;
          opacity: 0.75;
          pointer-events: none;
        }
        @keyframes titleBorderGlow {
          0%, 100% { opacity: 0.45; filter: blur(16px); }
          50% { opacity: 0.8; filter: blur(22px); }
        }

        /* Crisp animated outline (fake border without thickness) */
        .main-title::after, .premium-title::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          padding: 2px; /* virtual border width */
          background: linear-gradient(270deg, #a78bfa, #7c3aed, #d946ef, #a78bfa);
          background-size: 300% 100%;
          -webkit-mask: 
            linear-gradient(#000 0 0) content-box, 
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: titleOutlineSweep 6s linear infinite;
          pointer-events: none;
        }
        @keyframes titleOutlineSweep {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .title-emoji, .premium-emoji { font-size: 2.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 15px rgba(217, 70, 239, 0.8)); animation: premiumBounce 2s infinite; }
        .premium-emoji:first-child { animation-delay: 0s; } .premium-emoji:last-child { animation-delay: 0.5s; }
        @keyframes premiumBounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-15px) scale(1.1); } 60% { transform: translateY(-8px) scale(1.05); } }
        /* Subtle animated gradient text for main title */
        .title-text, .premium-text {
          background: linear-gradient(90deg, #e9d5ff, #a78bfa, #7c3aed, #a78bfa, #e9d5ff);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: titleTextSweep 6s linear infinite;
          position: relative;
          z-index: 2;
          text-shadow: none;
        }
        @keyframes titleTextSweep {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes premiumGradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .title-decoration, .premium-decoration { display: flex; justify-content: center; gap: 15px; margin-top: -10px; }
        .deco-item, .premium-deco { font-size: 1.5rem; animation: premiumBounce 2s infinite; filter: drop-shadow(0 0 10px rgba(217, 70, 239, 0.8)); transition: all 0.3s ease; }
        .premium-deco:hover { transform: scale(1.3) rotate(20deg); filter: drop-shadow(0 0 20px rgba(217, 70, 239, 1)); }
        .premium-deco:nth-child(2) { animation-delay: 0.3s; } .premium-deco:nth-child(3) { animation-delay: 0.6s; }
        .subtitle, .premium-subtitle { font-size: 1.2rem; color: #f0f8ff; font-weight: 600; text-shadow: 2px 2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(217, 70, 239, 0.6); margin-bottom: 15px; }
        .interactive-badges, .premium-badges { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .badge, .premium-badge { background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(217, 70, 239, 0.3)); backdrop-filter: blur(15px); padding: 10px 18px; border-radius: 25px; color: white; font-weight: 700; font-size: 0.9rem; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3); border: 2px solid rgba(217, 70, 239, 0.5); transition: all 0.3s ease; }
        .premium-badge:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 12px 35px rgba(124, 58, 237, 0.5); border-color: rgba(217, 70, 239, 0.8); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .tab-bar { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; position: relative; z-index: 1; flex-wrap: wrap; }
        .tab { padding: 12px 20px; border-radius: 25px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); font-weight: 700; cursor: pointer; border: none; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); position: relative; overflow: hidden; animation: slideIn 0.5s ease forwards; opacity: 0; }
        @keyframes slideIn { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(-20px); } }
        .tab:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        .tab.active { background: linear-gradient(45deg, #ff6b6b, #feca57); color: white; transform: scale(1.05); }
        .tab-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%); animation: glow 2s ease-in-out infinite; }
        @keyframes glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .tab-text { position: relative; z-index: 2; }
        .chapters-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; position: relative; z-index: 1; max-width: 100%; margin: 0 auto; padding: 0 10px; }
        .chapter-card, .premium-chapter-card { opacity: 0; transform: translateY(50px) scale(0.9); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; min-height: 360px; max-height: 360px; }
        .chapter-card.visible, .premium-chapter-card.visible { opacity: 1; transform: translateY(0) scale(1); }
        .chapter-card.hovered, .premium-chapter-card.hovered { transform: translateY(-15px) scale(1.05) rotateY(5deg); z-index: 10; }
        .card-gradient { border-radius: 20px; padding: 3px; background: transparent; transition: all 0.3s ease; display: block; }
        .card-gradient:hover { transform: translateY(-8px) rotate(2deg); box-shadow: 0 15px 35px rgba(124, 58, 237, 0.25); background: transparent; }
        @keyframes gradientMove { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        /* Premium Animated Thumbnails - Consistent Sizing */
        .premium-thumbnail {
          position: relative;
          width: 100%;
          height: 100px;
          margin-bottom: 15px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: none;
          transition: all 0.4s ease;
          background: rgba(255,255,255,0.04);
        }
        .premium-chapter-card:hover .premium-thumbnail { transform: scale(1.02); box-shadow: none; }
        .thumbnail-canvas { width: 100%; height: 100%; border-radius: 12px; image-rendering: pixelated; transition: filter 0.3s ease; }
        .premium-chapter-card:hover .thumbnail-canvas { filter: none; }
        .thumbnail-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: transparent; transition: background 0.3s ease; }
        .premium-chapter-card:hover .thumbnail-overlay { background: transparent; }
        .premium-chapter-icon { font-size: 3rem; filter: none; animation: iconFloat 3s ease-in-out infinite; transition: all 0.3s ease; }
        .premium-chapter-card:hover .premium-chapter-icon { transform: translateY(-5px) scale(1.15); filter: none; }
        @keyframes iconFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.1); } }
        .premium-badge { position: absolute; top: 8px; right: 8px; font-size: 1.5rem; background: rgba(26, 11, 46, 0.6); border-radius: 50%; padding: 4px; box-shadow: 0 0 15px rgba(217, 70, 239, 0.6); animation: badgePulse 2s ease-in-out infinite; transition: all 0.3s ease; }
        .premium-chapter-card:hover .premium-badge { transform: scale(1.3) rotate(10deg); box-shadow: 0 0 25px rgba(217, 70, 239, 1); }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .premium-card-content {
          background: rgba(26, 11, 46, 0.35) !important; /* translucent instead of transparent */
          border: 2px solid rgba(124, 58, 237, 0.5);
          border-radius: 17px;
          padding: 0;
          text-align: center;
          position: relative;
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .premium-chapter-card:hover .premium-card-content {
          border-color: rgba(217, 70, 239, 0.7);
          box-shadow: 0 12px 35px rgba(0,0,0,0.3);
          background: rgba(26, 11, 46, 0.45) !important; /* keep translucent on hover */
        }
        .premium-card-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 190px; min-height: 190px; max-height: 190px; padding: 15px; background: transparent !important; }
        .premium-actions { background: transparent !important; }
        .premium-btn, .premium-btn-secondary, .premium-btn-locked { background: linear-gradient(45deg, #7c3aed, #d946ef) !important; }
        .premium-btn-locked { background: linear-gradient(45deg, #4a5568, #6b7280) !important; }
        .premium-btn-secondary { background: linear-gradient(45deg, #4ecdc4, #44a08d) !important; }
        .chapter-icon-container { position: relative; display: inline-block; margin-bottom: 15px; }
        .chapter-icon { font-size: 2.5rem; display: block; animation: bounce 2s infinite; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
        .available-badge, .locked-badge { position: absolute; top: -5px; right: -5px; font-size: 1.2rem; background: transparent; border-radius: 50%; padding: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); animation: wiggle 2s infinite; }
        @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
        .chapter-title, .premium-title { color: white; font-size: 1.1rem; font-weight: 700; margin: 10px 0; line-height: 1.3; background: transparent; height: 2.6rem; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
        .category-badge, .premium-category { background: linear-gradient(45deg, #7c3aed, #d946ef); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 8px 0; display: inline-block; box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3); }
        .progress-bar, .premium-progress { background: rgba(124, 58, 237, 0.3); height: 8px; border-radius: 4px; margin: 10px 0; overflow: hidden; box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5); }
        .progress-fill, .premium-fill { background: linear-gradient(90deg, #7c3aed, #d946ef, #a855f7); height: 100%; border-radius: 4px; transition: width 0.3s ease; box-shadow: 0 0 15px rgba(217, 70, 239, 0.8); }
        .chapter-actions { display: flex; flex-direction: column; gap: 10px; }
        .action-btn, .premium-btn, .premium-btn-secondary, .premium-btn-locked { padding: 10px 16px; border-radius: 20px; font-weight: 700; cursor: pointer; border: none; transition: all 0.3s ease; font-size: 0.85rem; position: relative; overflow: hidden; text-align: center; text-decoration: none; background: transparent; }
        .action-btn:hover, .premium-btn:hover { transform: scale(1.05); }
        .btn, .premium-btn { background: linear-gradient(45deg, #7c3aed, #d946ef); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
        .btn:hover, .premium-btn:hover { box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5); transform: translateY(-2px) scale(1.05); }
        .btn-locked, .premium-btn-locked { background: linear-gradient(45deg, #4a5568, #6b7280); color: #cbd5e0; cursor: not-allowed; opacity: 0.7; }
        .btn-secondary, .premium-btn-secondary { background: linear-gradient(45deg, #4ecdc4, #44a08d); color: white; box-shadow: 0 4px 15px rgba(78,205,196,0.3); }
        .btn-secondary:hover, .premium-btn-secondary:hover { box-shadow: 0 8px 25px rgba(78,205,196,0.5); }
        /* Enhanced Premium Card Effects */
        .premium-chapter-card { position: relative; overflow: visible; background: transparent !important; }
        .premium-card-gradient, .card-gradient { background-image: linear-gradient(135deg, #7c3aed66, #d946ef66, #a855f766); box-shadow: 0 0 30px rgba(124, 58, 237, 0.4); border-radius: 20px; padding: 3px; transition: all 0.3s ease; display: block; }
        .premium-card-gradient:hover, .card-gradient:hover { transform: translateY(-8px) rotate(2deg); box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4); background-image: linear-gradient(135deg, #7c3aed88, #d946ef88, #a855f788); }
        .premium-glow-effect { position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; background: linear-gradient(135deg, #7c3aed33, #d946ef33); border-radius: 25px; opacity: 0; transition: opacity 0.3s ease; z-index: -1; filter: blur(15px); }
        .premium-chapter-card:hover .premium-glow-effect { opacity: 1; }
        .card-particles, .premium-particles { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; border-radius: 20px; overflow: hidden; }
        .particle, .premium-particle { position: absolute; width: 6px; height: 6px; background: linear-gradient(45deg, #d946ef, #7c3aed); border-radius: 50%; animation: premiumParticleFloat 1.5s ease-out forwards; box-shadow: 0 0 10px rgba(217, 70, 239, 0.8); }
        @keyframes premiumParticleFloat { 0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--x, 20px), var(--y, -30px)) scale(1.5) rotate(360deg); opacity: 0; } }
        .premium-btn, .premium-btn-secondary, .premium-btn-locked { font-family: 'Press Start 2P', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; transition: all 0.3s ease; }
        .premium-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 8px 25px rgba(124, 58, 237, 0.6); }
        .premium-title { font-family: 'Press Start 2P', monospace; font-size: 12px; letter-spacing: 1px; text-shadow: 0 0 10px rgba(217, 70, 239, 0.8); }
        .premium-category { font-family: 'Press Start 2P', monospace; font-size: 8px; letter-spacing: 2px; }
        .premium-progress { background: rgba(124, 58, 237, 0.3); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5); }
        .premium-fill { background: linear-gradient(90deg, #7c3aed, #d946ef, #a855f7); box-shadow: 0 0 15px rgba(217, 70, 239, 0.8); }
        .fun-footer { text-align: center; margin-top: 30px; padding: 20px; position: relative; z-index: 1; }
        .footer-content { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px; display: inline-block; border: 2px solid rgba(255,255,255,0.2); }
        .footer-text { color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .bounce-icon { font-size: 1.5rem; animation: bounce 2s infinite; display: inline-block; }
        @media (max-width: 1200px) { .chapters-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media (max-width: 900px) {
          .chapters-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .main-title { font-size: 2.5rem; }
          .title-emoji { font-size: 2rem; }
        }
        @media (max-width: 768px) {
          .main-title { font-size: 2rem; flex-direction: column; gap: 10px; }
          .title-emoji { font-size: 1.8rem; }
          .chapters-grid { grid-template-columns: 1fr; gap: 15px; }
          .tab-bar { gap: 10px; }
          .tab { padding: 8px 12px; font-size: 0.85rem; }
          .sal-root { padding: 15px; }
          .interactive-badges { flex-direction: column; align-items: center; }
          .footer-text { flex-direction: column; gap: 5px; font-size: 1rem; }
        }
      `}</style>
      </div>
  );
}