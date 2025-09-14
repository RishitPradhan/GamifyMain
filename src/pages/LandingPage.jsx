import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import './LandingPagePixel.css';

// Pixelated particles component
function PixelParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 12 + 6,
    delay: Math.random() * 3,
    color: i % 3 === 0 ? '#b8860b' : i % 3 === 1 ? '#8b5cf6' : '#c4b5fd'
  }));

  return (
    <div className="pixel-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pixel-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            boxShadow: `0 0 8px ${particle.color}`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-10, 10, -10],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Floating draggable avatars component with zero gravity physics
function FloatingAvatars() {
  const [avatars, setAvatars] = useState([]);
  const [isDragging, setIsDragging] = useState(null);

  useEffect(() => {
    // Create avatar data with random positions and velocities for space-like movement
    const heroHeight = window.innerHeight;
    const avatarData = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      src: `/avatars/${i + 1}.png`,
      x: Math.random() * (window.innerWidth - 150) + 75,
      y: Math.random() * (heroHeight - 200) + 100,
      vx: (Math.random() - 0.5) * 0.5, // Random velocity X
      vy: (Math.random() - 0.5) * 0.5, // Random velocity Y
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: 1.2 + Math.random() * 0.3
    }));
    setAvatars(avatarData);
  }, []);

  // Zero gravity physics animation
  useEffect(() => {
    const animateAvatars = () => {
      setAvatars(prev => prev.map(avatar => {
        if (isDragging === avatar.id) return avatar; // Don't animate while dragging
        
        const heroHeight = window.innerHeight;
        let newX = avatar.x + avatar.vx;
        let newY = avatar.y + avatar.vy;
        let newVx = avatar.vx;
        let newVy = avatar.vy;
        
        // Bounce off boundaries with some energy loss
        if (newX <= 75 || newX >= window.innerWidth - 75) {
          newVx = -avatar.vx * 0.8;
          newX = Math.max(75, Math.min(newX, window.innerWidth - 75));
        }
        if (newY <= 100 || newY >= heroHeight - 100) {
          newVy = -avatar.vy * 0.8;
          newY = Math.max(100, Math.min(newY, heroHeight - 100));
        }
        
        // Add slight random drift for more organic movement
        newVx += (Math.random() - 0.5) * 0.02;
        newVy += (Math.random() - 0.5) * 0.02;
        
        // Limit velocity to prevent too fast movement
        const maxVel = 1;
        newVx = Math.max(-maxVel, Math.min(maxVel, newVx));
        newVy = Math.max(-maxVel, Math.min(maxVel, newVy));
        
        return {
          ...avatar,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: avatar.rotation + avatar.rotationSpeed
        };
      }));
    };

    const interval = setInterval(animateAvatars, 16); // ~60fps
    return () => clearInterval(interval);
  }, [isDragging]);

  const updateAvatarPosition = (id, x, y) => {
    const heroHeight = window.innerHeight;
    const constrainedX = Math.max(75, Math.min(x, window.innerWidth - 75));
    const constrainedY = Math.max(100, Math.min(y, heroHeight - 100));
    
    setAvatars(prev => prev.map(avatar => 
      avatar.id === id ? { 
        ...avatar, 
        x: constrainedX, 
        y: constrainedY,
        vx: 0, // Reset velocity when manually positioned
        vy: 0
      } : avatar
    ));
  };

  return (
    <div className="floating-avatars">
      {avatars.map((avatar) => (
        <motion.div
          key={avatar.id}
          className="floating-avatar"
          drag
          dragMomentum={false}
          dragPropagation={false}
          dragConstraints={false}
          initial={{ 
            x: avatar.x, 
            y: avatar.y, 
            scale: 0,
            rotate: avatar.rotation
          }}
          animate={{ 
            scale: avatar.scale,
            rotate: [avatar.rotation, avatar.rotation + 10, avatar.rotation - 10, avatar.rotation],
            y: [avatar.y, avatar.y - 20, avatar.y + 10, avatar.y]
          }}
          transition={{
            scale: { duration: 0.5, delay: avatar.id * 0.1 },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
          }}
          onDragStart={() => setIsDragging(avatar.id)}
          onDragEnd={() => setIsDragging(null)}
          onDrag={(event, info) => {
            // Use offset instead of point for more natural dragging
            const newX = avatar.x + info.offset.x;
            const newY = avatar.y + info.offset.y;
            updateAvatarPosition(avatar.id, newX, newY);
          }}
          whileHover={{ scale: avatar.scale * 1.1, rotate: avatar.rotation + 15 }}
          whileDrag={{ 
            scale: avatar.scale * 1.3, 
            zIndex: 1000,
            rotate: avatar.rotation + 45,
            transition: { duration: 0.1 }
          }}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          dragSnapToOrigin={false}
        >
          <img
            src={avatar.src}
            alt={`Avatar ${avatar.id}`}
            className="avatar-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Rotating slogans component
function RotatingSlogan() {
  const slogans = [
    'LEVEL UP YOUR LEARNING',
    'PLAY • LEARN • CONQUER',
    'WHERE EDUCATION MEETS ADVENTURE',
    'UNLOCK YOUR POTENTIAL',
    'GAME ON, BRAIN ON',
    'LEARN LIKE A LEGEND'
  ];
  
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      className="hero-slogan"
      key={currentSlogan}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {slogans[currentSlogan]}
    </motion.div>
  );
}

function LandingPage() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { t, currentLanguage, changeLanguage, languages } = useLanguage();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <div className="landing-page">
      {/* Background Video with Purple Overlay */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="background-video"
        >
          <source src="/intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Pixelated Background Effects */}
      <div className="pixel-background">
        <PixelParticles />
        <div className="pixel-grid"></div>
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="navbar"
      >
        <motion.h1 
          className="navbar-brand" 
          aria-label="gamify"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="brand-gradient">gamify</span>
        </motion.h1>
        
        <div className="navbar-links">
          <motion.a 
            href="#features" 
            className="navbar-link"
            whileHover={{ y: -2, color: "#FFD700" }}
            transition={{ duration: 0.2 }}
          >
            {t('navbar.features') || 'FEATURES'}
          </motion.a>
          <motion.a 
            href="#about" 
            className="navbar-link"
            whileHover={{ y: -2, color: "#00FFFF" }}
            transition={{ duration: 0.2 }}
          >
            {t('navbar.about') || 'ABOUT'}
          </motion.a>
          <motion.a 
            href="#contact" 
            className="navbar-link"
            whileHover={{ y: -2, color: "#FF69B4" }}
            transition={{ duration: 0.2 }}
          >
            {t('navbar.contact') || 'CONTACT'}
          </motion.a>

          {/* Language Selector */}
          {languages && (
            <div className="language-selector">
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isAuthenticated ? (
            <div className="user-section">
              <span className="user-welcome">
                {t('navbar.welcome') || 'Welcome'}, {user?.user_metadata?.full_name || user?.email || 'Player'}!
              </span>
              <motion.button
                onClick={handleLogout}
                className="navbar-btn navbar-btn-secondary logout-btn"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('navbar.logout') || 'LOGOUT'}
              </motion.button>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="navbar-btn navbar-btn-primary">
                  {t('navbar.login') || 'LOGIN'}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="navbar-btn navbar-btn-secondary">
                  {t('navbar.signup') || 'SIGNUP'}
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section - Pixelated Gaming Theme */}
      <section className="pixel-hero-section">
        <div className="pixel-hero-container">
          {/* Main GAMIFY Title */}
          <motion.div
            className="pixel-title-container"
            initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            <motion.h1 
              className="pixel-main-title"
              animate={{ 
                textShadow: [
                  "0 0 30px #FFD700, 0 0 60px #FFD700, 0 0 90px #FFD700",
                  "0 0 40px #00FFFF, 0 0 70px #00FFFF, 0 0 100px #00FFFF",
                  "0 0 35px #FF69B4, 0 0 65px #FF69B4, 0 0 95px #FF69B4",
                  "0 0 30px #FFD700, 0 0 60px #FFD700, 0 0 90px #FFD700"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              GAMIFY
            </motion.h1>
            
            {/* Pixel decorations around title */}
            <div className="pixel-decorations">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={i}
                  className="pixel-decoration"
                  style={{
                    position: 'absolute',
                    width: `${8 + Math.random() * 8}px`,
                    height: `${8 + Math.random() * 8}px`,
                    background: i % 4 === 0 ? '#b8860b' : i % 4 === 1 ? '#8b5cf6' : i % 4 === 2 ? '#c4b5fd' : '#e6e6fa',
                    left: `${10 + i * 7}%`,
                    top: `${20 + (i % 4) * 15}%`,
                    boxShadow: `0 0 6px currentColor`
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    x: [-5, 5, -5],
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Rotating Slogan */}
          <motion.div
            className="pixel-slogan-container"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <RotatingSlogan />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="pixel-buttons-container"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              className="pixel-btn pixel-btn-primary"
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.08, 
                y: -5,
                boxShadow: "0 15px 40px rgba(255, 215, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              🎮 START ADVENTURE
            </motion.button>
            
            <motion.a
              href="#features"
              className="pixel-btn pixel-btn-secondary"
              whileHover={{ 
                scale: 1.08, 
                y: -5,
                boxShadow: "0 15px 40px rgba(0, 255, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              ⚡ EXPLORE FEATURES
            </motion.a>
          </motion.div>

          {/* Gaming Stats Display */}
          <motion.div
            className="pixel-stats"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="stat-number">1000+</span>
              <span className="stat-label">PLAYERS</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="stat-number">50+</span>
              <span className="stat-label">LEVELS</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="stat-number">∞</span>
              <span className="stat-label">FUN</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Avatars */}
        <FloatingAvatars />
      </section>

      {/* Features Section - Gaming Theme */}
      <section id="features" className="pixel-features-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pixel-features-container"
        >
          <h2 className="pixel-section-title">POWER-UPS</h2>
          <div className="pixel-features-grid">
            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className="pixel-feature-icon">🎮</div>
              <h3>GAMIFIED LEARNING</h3>
              <p>Turn boring lessons into epic quests with XP, levels, and achievements!</p>
            </motion.div>

            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className="pixel-feature-icon">📊</div>
              <h3>PROGRESS TRACKING</h3>
              <p>Watch your skills grow with detailed stats and performance analytics!</p>
            </motion.div>

            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className="pixel-feature-icon">🏆</div>
              <h3>EPIC REWARDS</h3>
              <p>Unlock badges, trophies, and special items as you master new concepts!</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Subjects Preview - Gaming Style */}
      <section className="pixel-subjects-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pixel-subjects-container"
        >
          <h2 className="pixel-section-title">CHOOSE YOUR QUEST</h2>
          <p className="pixel-section-subtitle">Select your adventure and start leveling up!</p>
        </motion.div>

        <div className="pixel-subjects-grid">
          <motion.div
            className="pixel-subject-card math-card"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 8 }}
          >
            {/* Animated Math Icons */}
            <div className="subject-icon-container">
              <motion.div 
                className="subject-icon math-icon"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📐
              </motion.div>
              <motion.div 
                className="floating-math-symbols"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span>∑</span>
                <span>π</span>
                <span>∞</span>
              </motion.div>
            </div>
            
            <h3>MATHEMATICS</h3>
            <p>Master numbers and equations in this epic mathematical adventure!</p>
            
            {/* Interactive Math Preview */}
            <motion.div 
              className="subject-preview"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mini-game-preview">
                <div className="equation-display">
                  <motion.span
                    animate={{ color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFD700'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    2x + 5 = 13
                  </motion.span>
                </div>
                <div className="xp-preview">+50 XP</div>
              </div>
            </motion.div>
            
            <Link to="/lesson/math" className="pixel-subject-btn">
              🎯 ENTER REALM
            </Link>
          </motion.div>

          <motion.div
            className="pixel-subject-card science-card"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: -8 }}
          >
            {/* Animated Science Icons */}
            <div className="subject-icon-container">
              <motion.div 
                className="subject-icon science-icon"
                animate={{ 
                  scale: [1, 1.2, 1],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)']
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔬
              </motion.div>
              <motion.div 
                className="floating-science-symbols"
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span>⚛️</span>
                <span>🧪</span>
                <span>⚡</span>
              </motion.div>
            </div>
            
            <h3>SCIENCE</h3>
            <p>Explore the mysteries of physics, chemistry, and biology!</p>
            
            {/* Interactive Science Preview */}
            <motion.div 
              className="subject-preview"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mini-game-preview">
                <div className="formula-display">
                  <motion.span
                    animate={{ color: ['#00FF7F', '#FF4500', '#1E90FF', '#00FF7F'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    F = ma
                  </motion.span>
                </div>
                <div className="achievement-preview">🏆 Physics Master</div>
              </div>
            </motion.div>
            
            <Link to="/lesson/science" className="pixel-subject-btn">
              🚀 ENTER REALM
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Gaming Style */}
      <section className="pixel-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pixel-cta-container"
        >
          <h2 className="pixel-cta-title">READY TO LEVEL UP?</h2>
          <p className="pixel-cta-text">
            Join thousands of players on the ultimate learning adventure!
          </p>
          <motion.button
            onClick={handleGetStarted}
            className="pixel-cta-btn"
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              boxShadow: "0 20px 50px rgba(255, 105, 180, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 BEGIN YOUR JOURNEY
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="contact"
        className="footer"
      >
        <div className="footer-container">
          <p>{t('footer.copyright') || '© 2024 Gamify. All rights reserved.'}</p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              {t('footer.privacy') || 'Privacy'}
            </a>
            <a href="#" className="footer-link">
              {t('footer.terms') || 'Terms'}
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;
