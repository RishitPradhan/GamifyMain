import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import './LandingPage.css';

// Pixelated particles component
function PixelParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2
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
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
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
    'GAME ON, BRAIN ON'
  ];
  
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      className="hero-slogan"
      key={currentSlogan}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
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
      {/* Pixelated Background */}
      <div className="pixel-background">
        <PixelParticles />
        <div className="pixel-grid"></div>
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="navbar"
      >
        <h1 className="navbar-brand" aria-label="gamify">
          <span className="brand-gradient">gamify</span>
        </h1>
        <div className="navbar-links">
          <a href="#features" className="navbar-link">
            {t('navbar.features')}
          </a>
          <a href="#about" className="navbar-link">
            {t('navbar.about')}
          </a>
          <a href="#contact" className="navbar-link">
            {t('navbar.contact')}
          </a>

          {/* Language Selector */}
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

          {isAuthenticated ? (
            <div className="user-section">
              <span className="user-welcome">
                {t('navbar.welcome')}, {user?.user_metadata?.full_name || user?.email || 'Student'}!
              </span>
              <button
                onClick={handleLogout}
                className="navbar-btn navbar-btn-secondary logout-btn"
              >
                {t('navbar.logout')}
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-btn navbar-btn-primary"
              >
                {t('navbar.login')}
              </Link>
              <Link
                to="/signup"
                className="navbar-btn navbar-btn-secondary"
              >
                {t('navbar.signup')}
              </Link>
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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="pixel-main-title"
              animate={{ 
                textShadow: [
                  "0 0 20px #8b5cf6, 0 0 40px #8b5cf6, 0 0 60px #8b5cf6",
                  "0 0 30px #a855f7, 0 0 50px #a855f7, 0 0 70px #a855f7",
                  "0 0 20px #8b5cf6, 0 0 40px #8b5cf6, 0 0 60px #8b5cf6"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              GAMIFY
            </motion.h1>
            
            {/* Pixel decorations around title */}
            <div className="pixel-decorations">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="pixel-decoration"
                  style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    background: i % 2 === 0 ? '#8b5cf6' : '#ec4899',
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 3) * 20}%`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Rotating Slogan */}
          <motion.div
            className="pixel-slogan-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <RotatingSlogan />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="pixel-buttons-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              className="start-btn"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶ Start Adventure
            </motion.button>
            
            <motion.a
              href="#features"
              className="hero-btn hero-btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ EXPLORE FEATURES
            </motion.a>
          </motion.div>

          {/* Gaming Stats Display */}
          <motion.div
            className="pixel-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">PLAYERS</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">LEVELS</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">FUN</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Gaming Theme */}
      <section id="features" className="pixel-features-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pixel-features-container"
        >
          <h2 className="pixel-section-title">POWER-UPS</h2>
          <div className="pixel-features-grid">
            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="pixel-feature-icon">🎮</div>
              <h3>GAMIFIED LEARNING</h3>
              <p>Turn boring lessons into epic quests with XP, levels, and achievements!</p>
            </motion.div>

            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="pixel-feature-icon">📊</div>
              <h3>PROGRESS TRACKING</h3>
              <p>Watch your skills grow with detailed stats and performance analytics!</p>
            </motion.div>

            <motion.div
              className="pixel-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
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
          initial={{ opacity: 0, y: 30 }}
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
            className="pixel-subject-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <div className="subject-icon">📐</div>
            <h3>MATHEMATICS</h3>
            <p>Master numbers and equations in this epic mathematical adventure!</p>
            <Link to="/lesson/math" className="pixel-subject-btn">ENTER REALM</Link>
          </motion.div>

          <motion.div
            className="pixel-subject-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
          >
            <div className="subject-icon">🔬</div>
            <h3>SCIENCE</h3>
            <p>Explore the mysteries of physics, chemistry, and biology!</p>
            <Link to="/lesson/science" className="pixel-subject-btn">ENTER REALM</Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Gaming Style */}
      <section className="pixel-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
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
            whileHover={{ scale: 1.1, y: -3 }}
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
          <p>{t('footer.copyright')}</p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              {t('footer.privacy')}
            </a>
            <a href="#" className="footer-link">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;
