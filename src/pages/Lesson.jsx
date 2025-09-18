import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function ScienceAdventureLab() {
  const [showCards, setShowCards] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowCards(true), 300);
    return () => clearTimeout(t);
  }, []);

  const chapters = useMemo(() => [
    { title: 'Crop Production and Management', category: 'Biology', icon: '🌱', status: 'locked', link: '/chapter1', pdfLink: '/pdfs/chapter1.pdf' },
    { title: 'Plant Life', category: 'Biology', icon: '🌿', status: 'locked', link: '/chapter2', pdfLink: '/pdfs/chapter2.pdf' },
    { title: 'Animal Kingdom', category: 'Biology', icon: '🦁', status: 'locked', link: '/chapter3', pdfLink: '/pdfs/chapter3.pdf' },
    { title: 'Water Cycle', category: 'Earth', icon: '💧', status: 'locked', link: '/chapter4', pdfLink: '/pdfs/chapter4.pdf' },
    { title: 'Human Body', category: 'Biology', icon: '🫀', status: 'locked', link: '/chapter5', pdfLink: '/pdfs/chapter5.pdf' },
    { title: 'Electricity', category: 'Physics', icon: '⚡', status: 'locked', link: '/chapter6', pdfLink: '/pdfs/chapter6.pdf' },
    { title: 'Chemistry', category: 'Chemistry', icon: '🧪', status: 'locked', link: '/chapter7', pdfLink: '/pdfs/chapter7.pdf' },
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
    <div className="sal-root">
      <div className="background-container">
        {/* Premium Animated Background */}
        <div className="premium-bg-layer"></div>
        <div className="particle-system">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="bg-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
        <div className="floating-shapes">
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
        <div className="title-container premium-title-container">
          <div className="title-glow-effect"></div>
          <h1 className="main-title premium-title">
            <span className="title-emoji premium-emoji">🌟</span>
            <span className="title-text premium-text">Super Science Explorers</span>
            <span className="title-emoji premium-emoji">🚀</span>
          </h1>
          <div className="title-decoration premium-decoration">
            <span className="deco-item premium-deco">🔬</span>
            <span className="deco-item premium-deco">⚗</span>
            <span className="deco-item premium-deco">🧪</span>
          </div>
          <div className="title-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="title-particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}></div>
            ))}
          </div>
        </div>
        <p className="subtitle premium-subtitle">Discover, Learn, and Have Fun with Science!</p>
        <div className="interactive-badges premium-badges">
          <span className="badge pulse premium-badge">🎮 Play & Learn</span>
          <span className="badge pulse premium-badge" style={{ animationDelay: '1s' }}>🏆 Earn Badges</span>
          <span className="badge pulse premium-badge" style={{ animationDelay: '2s' }}>🌍 Explore Worlds</span>
          <span className="badge pulse premium-badge" style={{ animationDelay: '3s' }}>⚡ Power Up</span>
        </div>
      </header>

      <div className="tab-bar">
        {['All', 'Physics', 'Biology', 'Earth', 'Chemistry'].map((tab, index) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="tab-text">{tab}</span>
            {activeTab === tab && <div className="tab-glow"></div>}
          </button>
        ))}
      </div>

      <div className="chapters-grid">
        {filteredChapters.map((chapter, index) => {
          const isAvailable = chapter.status === 'available';
          return (
            <div
              key={index}
              className={`premium-chapter-card ${showCards ? 'visible' : ''} ${hoveredCard === index ? 'hovered' : ''}`}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="premium-card-gradient">
                <div className="premium-card-content">
                  {/* Animated Thumbnail Canvas */}
                  <div className="premium-thumbnail">
                    <canvas 
                      className="thumbnail-canvas"
                      width="200"
                      height="120"
                      ref={el => {
                        if (el && !el.dataset.animated) {
                          el.dataset.animated = 'true';
                          const canvas = el;
                          const ctx = canvas.getContext('2d');
                          const width = canvas.width;
                          const height = canvas.height;
                          let animFrame = 0;
                          const particles = Array.from({length: 6}, (_, i) => ({
                            x: Math.random() * width,
                            y: Math.random() * height,
                            vx: (Math.random() - 0.5) * 0.2,
                            vy: (Math.random() - 0.5) * 0.2,
                            size: Math.random() * 2 + 1.5,
                            phase: i * 0.8
                          }));
                          
                          const animate = () => {
                            // Clear with deep space background
                            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
                            gradient.addColorStop(0, '#2d1b4e');
                            gradient.addColorStop(0.5, '#1b1233');
                            gradient.addColorStop(1, '#0f0820');
                            ctx.fillStyle = gradient;
                            ctx.fillRect(0, 0, width, height);
                            
                            // Subtle science grid pattern
                            ctx.strokeStyle = `rgba(124, 58, 237, ${0.25 + Math.sin(animFrame * 0.01) * 0.1})`;
                            ctx.lineWidth = 0.8;
                            const gridSize = 30;
                            
                            for (let i = 0; i < width; i += gridSize) {
                              const x = i + Math.sin(animFrame * 0.008 + i * 0.005) * 3;
                              ctx.beginPath();
                              ctx.moveTo(x, 0);
                              ctx.lineTo(x, height);
                              ctx.stroke();
                            }
                            
                            for (let i = 0; i < height; i += gridSize) {
                              const y = i + Math.cos(animFrame * 0.01 + i * 0.005) * 2;
                              ctx.beginPath();
                              ctx.moveTo(0, y);
                              ctx.lineTo(width, y);
                              ctx.stroke();
                            }
                            
                            // Gentle floating particles
                            particles.forEach((particle, i) => {
                              particle.x += particle.vx;
                              particle.y += particle.vy;
                              
                              if (particle.x < 0 || particle.x > width) particle.vx *= -1;
                              if (particle.y < 0 || particle.y > height) particle.vy *= -1;
                              
                              const alpha = 0.4 + Math.sin(animFrame * 0.02 + particle.phase) * 0.2;
                              const size = particle.size + Math.sin(animFrame * 0.025 + particle.phase) * 0.5;
                              
                              // Subtle particle glow
                              const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 2);
                              glowGradient.addColorStop(0, `rgba(217, 70, 239, ${alpha * 0.6})`);
                              glowGradient.addColorStop(0.7, `rgba(124, 58, 237, ${alpha * 0.3})`);
                              glowGradient.addColorStop(1, 'rgba(217, 70, 239, 0)');
                              
                              ctx.fillStyle = glowGradient;
                              ctx.beginPath();
                              ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
                              ctx.fill();
                              
                              // Core particle
                              ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                              ctx.beginPath();
                              ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                              ctx.fill();
                            });
                            
                            // Subtle energy pulse (single wave)
                            const radius = (animFrame * 0.3) % 80;
                            const alpha = Math.max(0, 0.3 - (radius / 80) * 0.3);
                            if (alpha > 0) {
                              ctx.strokeStyle = `rgba(217, 70, 239, ${alpha})`;
                              ctx.lineWidth = 1.5;
                              ctx.beginPath();
                              ctx.arc(width/2, height/2, radius, 0, Math.PI * 2);
                              ctx.stroke();
                            }
                            
                            // Canvas background complete - emoji shown in overlay only
                            
                            animFrame++;
                            requestAnimationFrame(animate);
                          };
                          animate();
                        }
                      }}
                    ></canvas>
                    <div className="thumbnail-overlay">
                      <span className="premium-chapter-icon">{chapter.icon}</span>
                      {isAvailable ? (
                        <span className="available-badge premium-badge">✅</span>
                      ) : (
                        <span className="locked-badge premium-badge">🔒</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="premium-card-body">
                    <h3 className="chapter-title premium-title">{chapter.title}</h3>
                    <span className="category-badge premium-category">{chapter.category}</span>
                    <div className="progress-bar premium-progress">
                      <div className="progress-fill premium-fill" style={{ width: isAvailable ? '100%' : '0%' }}></div>
                    </div>
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
                          {chapter.title && /force/i.test(chapter.title) ? (
                            <a
                              href="https://muti-science-quiz-final.netlify.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="premium-btn-secondary"
                            >
                              🔥 Challenge Your Friends
                            </a>
                          ) : (
                            <button className="premium-btn-secondary" disabled>
                              🔒 Challenge locked
                            </button>
                          )}
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
                          {chapter.title && /force/i.test(chapter.title) ? (
                            <a
                              href="https://muti-science-quiz-final.netlify.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="premium-btn-secondary"
                            >
                              🔥 Challenge Your Friends
                            </a>
                          ) : (
                            <button className="premium-btn-locked" disabled>
                              🔒 Challenge Locked
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Particle Effects */}
              {hoveredCard === index && (
                <div className="card-particles premium-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="particle premium-particle" style={{ 
                      animationDelay: `${i * 0.08}s`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}></div>
                  ))}
                </div>
              )}
              
              {/* Glow Effect */}
              <div className="premium-glow-effect"></div>
            </div>
          );
        })}
      </div>

      <div className="fun-footer">
        <div className="footer-content">
          <span className="footer-text">
            <span className="bounce-icon">🎯</span>
            <span className="bounce-icon" style={{ animationDelay: '0.2s' }}>🚀</span>
            Ready to become a Science Superstar? You are in the correct Place..
            <span className="bounce-icon" style={{ animationDelay: '0.4s' }}>🌟</span>
            <span className="bounce-icon" style={{ animationDelay: '0.6s' }}>🔬</span>
          </span>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #1a0b2e !important; margin: 0; padding: 0; height: 100%; overflow-x: hidden; }
        .sal-root {
          min-height: 100vh;
          height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
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
        .main-title, .premium-title { font-size: 3rem; font-weight: 900; color: white; text-shadow: 4px 4px 8px rgba(0,0,0,0.3), 0 0 30px rgba(217, 70, 239, 0.8); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 15px; }
        .title-emoji, .premium-emoji { font-size: 2.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 15px rgba(217, 70, 239, 0.8)); animation: premiumBounce 2s infinite; }
        .premium-emoji:first-child { animation-delay: 0s; } .premium-emoji:last-child { animation-delay: 0.5s; }
        @keyframes premiumBounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-15px) scale(1.1); } 60% { transform: translateY(-8px) scale(1.05); } }
        .title-text, .premium-text { background: linear-gradient(45deg, #d946ef, #7c3aed, #a855f7, #ec4899); background-size: 400% 400%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: premiumGradientShift 3s ease infinite; position: relative; z-index: 2; }
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
        .chapter-card, .premium-chapter-card { opacity: 0; transform: translateY(50px) scale(0.9); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; min-height: 480px; max-height: none; }
        .chapter-card.visible, .premium-chapter-card.visible { opacity: 1; transform: translateY(0) scale(1); }
        .chapter-card.hovered, .premium-chapter-card.hovered { transform: translateY(-15px) scale(1.05) rotateY(5deg); z-index: 10; }
        .card-gradient { border-radius: 20px; padding: 3px; background-image: linear-gradient(135deg, #7c3aed55, #d946ef55, #a855f755); background-size: 200% 200%; animation: gradientMove 4s ease infinite; transition: all 0.3s ease; display: block; }
        .card-gradient:hover { transform: translateY(-8px) rotate(2deg); box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4); background-image: linear-gradient(135deg, #7c3aed88, #d946ef88, #a855f788); }
        @keyframes gradientMove { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        /* Premium Animated Thumbnails - Consistent Sizing */
        .premium-thumbnail { position: relative; width: 100%; height: 160px; margin-bottom: 15px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); transition: all 0.4s ease; }
        .premium-chapter-card:hover .premium-thumbnail { transform: scale(1.02); box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5); }
        .thumbnail-canvas { width: 100%; height: 100%; border-radius: 12px; image-rendering: pixelated; transition: filter 0.3s ease; }
        .premium-chapter-card:hover .thumbnail-canvas { filter: brightness(1.1) contrast(1.1); }
        .thumbnail-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(26, 11, 46, 0.3); transition: background 0.3s ease; }
        .premium-chapter-card:hover .thumbnail-overlay { background: rgba(26, 11, 46, 0.1); }
        .premium-chapter-icon { font-size: 3rem; filter: drop-shadow(0 0 15px rgba(217, 70, 239, 0.8)); animation: iconFloat 3s ease-in-out infinite; transition: all 0.3s ease; }
        .premium-chapter-card:hover .premium-chapter-icon { transform: translateY(-5px) scale(1.15); filter: drop-shadow(0 0 25px rgba(217, 70, 239, 1)); }
        @keyframes iconFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.1); } }
        .premium-badge { position: absolute; top: 8px; right: 8px; font-size: 1.5rem; background: rgba(26, 11, 46, 0.9); border-radius: 50%; padding: 4px; box-shadow: 0 0 15px rgba(217, 70, 239, 0.8); animation: badgePulse 2s ease-in-out infinite; transition: all 0.3s ease; }
        .premium-chapter-card:hover .premium-badge { transform: scale(1.3) rotate(10deg); box-shadow: 0 0 25px rgba(217, 70, 239, 1); }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .premium-card-content { background: linear-gradient(135deg, #1b1233 0%, #2d1b4e 50%, #1a0b2e 100%) !important; border: 2px solid #7c3aed; border-radius: 17px; padding: 0; text-align: center; position: relative; backdrop-filter: blur(10px); height: 100%; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); transition: all 0.4s ease; overflow: hidden; }
        .premium-chapter-card:hover .premium-card-content { border-color: #d946ef; box-shadow: 0 0 30px rgba(217, 70, 239, 0.6); background: linear-gradient(135deg, #1f1540 0%, #341b5e 50%, #1e0c36 100%) !important; }
        .premium-card-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: auto; min-height: 260px; max-height: none; padding: 15px; background: transparent !important; }
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
        /* Ensure chapter title in cards fits without clipping (max 2 lines) */
        .premium-card-body .chapter-title {
          height: auto;
          min-height: 3.6rem; /* enough for two lines with current font-size */
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }
        /* Small spacing before buttons */
        .premium-card-body .chapter-actions { margin-top: 6px; }
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