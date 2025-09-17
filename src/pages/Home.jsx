import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import NetworkStatusIndicator from "../components/NetworkStatusIndicator";
import './Home.css';

export default function Home() {
  const [selectedClass, setSelectedClass] = useState("8");
  const [activeSection, setActiveSection] = useState("student");
  const { user } = useAuth();
  const { studentProgress, loading, getBadge, isNewUser, setMeta } = useProgress();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Resume button pulsing animation controls
  const resumeBtnRef = useRef(null);
  const resumeControls = useAnimation();
  const resumeInView = useInView(resumeBtnRef, { amount: 0.4 });

  useEffect(() => {
    if (resumeInView) {
      resumeControls.start({
        scale: [0.8, 1, 0.8],
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      });
    } else {
      resumeControls.stop();
      resumeControls.set({ scale: 1 });
    }
  }, [resumeInView, resumeControls]);

  // Scroll to hash (e.g., /home#daily-challenge)
  useEffect(() => {
    const scrollToHash = () => {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    // attempt immediately and after a short delay to ensure content is rendered
    scrollToHash();
    const id = setTimeout(scrollToHash, 150);
    return () => clearTimeout(id);
  }, [location.hash]);

  // Persist current user email for leaderboard highlighting
  useEffect(() => {
    if (user?.email) {
      try { localStorage.setItem('current_user_email', user.email); } catch {}
    }
  }, [user?.email]);

  // ===== LocalStorage helpers for progress/claims =====
  const progressKey = useMemo(() => {
    if (user?.email) return `student_progress_${user.email}`;
    // fallback to first found key
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('student_progress_')) return k;
    }
    return null;
  }, [user?.email]);

  const readProgressLS = () => {
    if (!progressKey) return {};
    try { return JSON.parse(localStorage.getItem(progressKey)) || {}; } catch { return {}; }
  };

  // Daily challenge state
  const DAILY_CHALLENGE_XP = 50;
  const [dailyDone, setDailyDone] = useState(false);
  const [dailyActive, setDailyActive] = useState(false);
  const [dailyQs, setDailyQs] = useState([]);
  const [dailyAns, setDailyAns] = useState({});
  const [dailyScore, setDailyScore] = useState(null);
  useEffect(() => {
    setDailyDone(studentProgress?.dailyChallengeDate === todayStr());
  }, [studentProgress?.dailyChallengeDate]);

  const handleDailyStart = () => {
    // Build 3 random questions (math & science)
    const pool = [
      { id: 'm1', q: 'What is 7 × 6?', choices: ['36','40','42','48'], correct: 2 },
      { id: 'm2', q: 'Simplify: 3/4 + 1/4 = ?', choices: ['1/2','1','3/4','4/4'], correct: 1 },
      { id: 'm3', q: 'Find the value of x: 2x + 4 = 10', choices: ['3','2','4','6'], correct: 0 },
      { id: 's1', q: 'Water boils at what temperature at sea level?', choices: ['50°C','100°C','150°C','212°C'], correct: 1 },
      { id: 's2', q: 'Which gas do plants absorb from the air?', choices: ['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'], correct: 1 },
      { id: 's3', q: 'Force is measured in?', choices: ['Joules','Watts','Newtons','Pascals'], correct: 2 },
    ];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0,3);
    setDailyQs(shuffled);
    setDailyAns({});
    setDailyScore(null);
    setDailyActive(true);
  };

  const submitDaily = () => {
    // Require all answered
    if (dailyQs.some((q) => dailyAns[q.id] === undefined)) return;
    const score = dailyQs.reduce((acc, q) => acc + (dailyAns[q.id] === q.correct ? 1 : 0), 0);
    setDailyScore(score);
    const today = todayStr();
    if (studentProgress?.dailyChallengeDate !== today) {
      const prevDate = studentProgress?.dailyChallengeDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0,10);
      const newStreak = prevDate === yStr ? Math.max(1, (studentProgress?.streak || 0) + 1) : 1;
      setMeta({
        totalXP: (studentProgress?.totalXP || 0) + DAILY_CHALLENGE_XP,
        dailyChallengeDate: today,
        streak: newStreak,
      });
    }
    setDailyDone(true);
    setDailyActive(false);
    pushRecent('⚡', `Completed daily challenge (${score}/3) +${DAILY_CHALLENGE_XP} XP`);
  };
  const writeProgressLS = (obj) => {
    if (!progressKey) return;
    localStorage.setItem(progressKey, JSON.stringify(obj));
  };

  const recentKey = useMemo(() => (
    progressKey ? `ach_recent_${progressKey.replace('student_progress_','')}` : null
  ), [progressKey]);
  const pushRecent = (icon, text) => {
    if (!recentKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(recentKey) || '[]');
      arr.unshift({ icon, text, ts: Date.now() });
      localStorage.setItem(recentKey, JSON.stringify(arr.slice(0, 20)));
    } catch {}
  };

  const todayStr = () => new Date().toISOString().slice(0,10);

  // Get all registered students' data from localStorage
  const getAllStudentsData = () => {
    const studentsData = [];
    const subjects = ['science', 'technology', 'mathematics'];
    
    // Get all localStorage keys that start with 'student_progress_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('student_progress_')) {
        try {
          const userKey = key.replace('student_progress_', '');
          const progressData = JSON.parse(localStorage.getItem(key));
          
          // Get user info from localStorage or use email as name
          const userInfo = JSON.parse(localStorage.getItem(`user_info_${userKey}`)) || {};
          const studentName = userInfo.full_name || userInfo.name || userKey.split('@')[0] || 'Student';
          const studentClass = userInfo.class || '6'; // Default class
          
          // Calculate badges based on progress
          const getBadge = (progress) => {
            const avgScore = (progress.games + progress.quizzes) / 2;
            if (avgScore >= 80) return "Gold";
            if (avgScore >= 60) return "Silver";
            return "Bronze";
          };
          
          const studentData = {
            id: userKey,
            name: studentName,
            class: studentClass,
            email: userKey,
            science: { 
              games: progressData.science?.games || 0, 
              quizzes: progressData.science?.quizzes || 0, 
              badge: getBadge(progressData.science || { games: 0, quizzes: 0 })
            },
            technology: { 
              games: progressData.technology?.games || 0, 
              quizzes: progressData.technology?.quizzes || 0, 
              badge: getBadge(progressData.technology || { games: 0, quizzes: 0 })
            },
            mathematics: { 
              games: progressData.mathematics?.games || 0, 
              quizzes: progressData.mathematics?.quizzes || 0, 
              badge: getBadge(progressData.mathematics || { games: 0, quizzes: 0 })
            }
          };
          
          studentsData.push(studentData);
        } catch (error) {
          console.error('Error parsing student data for key:', key, error);
        }
      }
    }
    
    return studentsData;
  };

  const studentsData = getAllStudentsData();

  const subjects = [
    {
      name: "Science",
      key: "science",
      icon: "🧪",
      gradient: "linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)",
      description: "Discover the secrets of the universe!",
      gameElements: ["⚗️", "🔬", "🧬", "⚡", "🌟"],
      funFact: "Did you know? Lightning is 5x hotter than the Sun!\nA single bolt contains 5 billion joules of energy!",
      level: "Apprentice Scientist",
      xp: 150
    },
    {
      name: "Mathematics",
      key: "mathematics",
      icon: "🎯",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #9f7aea 100%)",
      description: "Solve puzzles and unlock the power of numbers!",
      gameElements: ["🎲", "🧮", "📊", "🎪", "💎"],
      funFact: "Math is everywhere - even in video games!\nEvery pixel on your screen uses coordinates!",
      level: "Number Ninja",
      xp: 200
    }
  ];

  const handleSubjectClick = (subjectKey) => {
    const subject = subjects.find(s => s.key === subjectKey);
    // Route Science and Mathematics to their chapter selection pages
    if (subjectKey === 'science') {
      navigate('/lesson/science');
      return;
    }
    if (subjectKey === 'mathematics') {
      navigate('/lesson/math');
      return;
    }
    // Fallback: go to SubjectDetail for other subjects
    navigate(`/subject/${subjectKey}`, {
      state: { class: selectedClass, subject }
    });
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="home-dashboard">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            📚
          </motion.div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      {/* Global Navbar is used; no local navbar here */}

      {/* VIP Hero: Greeting + XP snapshot + Continue CTA */}
      <motion.section
        className="vip-hero glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="vip-hero-inner">
          <div className="vip-hero-left">
            <h2 className="vip-hero-title">{`Welcome${user ? `, ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Player'}` : ''}`}</h2>
            <p className="vip-hero-sub">Ready to continue your quest?</p>
            <div className="vip-hero-actions">
              <button className="start-btn" onClick={() => navigate('/home')}>
                ▶ Continue Learning
              </button>
              <Link to="/rewards" className="start-btn alt">🏆 Rewards</Link>
            </div>
          </div>
          <div className="vip-hero-right">
            <div className="vip-stat">
              <div className="vip-stat-label">Total XP</div>
              <div className="vip-stat-value">{studentProgress?.totalXP ?? 0}</div>
            </div>
            <div className="vip-stat">
              <div className="vip-stat-label">Streak</div>
              <div className="vip-stat-value">{studentProgress?.streak ?? 0}🔥</div>
            </div>
            <div className="vip-stat">
              <div className="vip-stat-label">Quests</div>
              <div className="vip-stat-value">{studentProgress?.questsCompleted ?? 0}</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        className="vip-quick-actions"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="quick-actions-row">
          <Link className="quick-action glass-card" to="/home">🎮 Resume</Link>
          <Link className="quick-action glass-card" to="/lesson/math">🧠 Start a Quest</Link>
          <Link className="quick-action glass-card" to="#daily-challenge">⚡ Daily Challenge</Link>
          <Link className="quick-action glass-card" to="/rewards">🎁 Rewards</Link>
        </div>
      </motion.section>

      {/* Continue Learning Strip */}
      <motion.section
        className="vip-continue glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="continue-inner">
          <div className="continue-info">
            <div className="continue-title">Continue Learning</div>
            <div className="continue-sub">Pick up where you left off</div>
          </div>
          <div className="continue-progress">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, studentProgress?.lastLessonProgress ?? 0)}%` }} /></div>
            <motion.button
              className="start-btn"
              onClick={() => navigate('/home')}
              ref={resumeBtnRef}
              initial={{ scale: 1 }}
              animate={resumeControls}
            >
              ▶ Resume
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="student-section"
      >
            {/* Class Selection */}
            <motion.div 
              className="class-selection glass-card gamified-class-selection"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="class-selection-title">
                <span className="title-icon">🎯</span>
                Select Your Class
                <span className="title-decoration">⚡</span>
              </h3>
              <div className="dropdown-container">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="class-dropdown gamified-dropdown"
                >
                  {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>Class {grade}</option>
                  ))}
                </select>
                <div className="dropdown-arrow">▼</div>
              </div>
            </motion.div>

            {/* STEM Subject Cards */}
            <motion.div 
              className="subjects-grid"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="section-title">Choose Your Subject</h2>
              <div className="subjects-container">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.key}
                    className="subject-card glass-card gamified-card"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubjectClick(subject.key)}
                  >
                    {/* Floating Game Elements */}
                    <div className="floating-game-elements">
                      {subject.gameElements.map((element, i) => (
                        <motion.div
                          key={i}
                          className="floating-element"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0.3, 0.7, 0.3],
                            scale: [0.8, 1.2, 0.8],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          style={{
                            position: 'absolute',
                            top: `${20 + i * 15}%`,
                            right: `${10 + i * 8}%`,
                            fontSize: '1.2rem',
                            zIndex: 1
                          }}
                        >
                          {element}
                        </motion.div>
                      ))}
                    </div>

                    {/* Level and XP Display */}
                    <div className="game-stats">
                      <div className="level-badge">
                        <span className="level-text">{subject.level}</span>
                      </div>
                      <div className="xp-display">
                        <span className="xp-icon">⭐</span>
                        <span className="xp-text">{subject.xp} XP</span>
                      </div>
                    </div>

                    <div className="subject-icon-container">
                      <motion.div 
                        className="subject-icon"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        {subject.icon}
                      </motion.div>
                    </div>
                    <h3 className="subject-name">{subject.name}</h3>
                    <p className="subject-description">{subject.description}</p>
                    
                    {/* Fun Fact */}
                    <motion.div 
                      className="fun-fact"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                    >
                      <span className="fact-icon">💡</span>
                      <span className="fact-text">{subject.funFact}</span>
                    </motion.div>
                    
                    {/* Progress Bars */}
                    <div className="progress-section">
                      <div className="progress-item">
                        <span>Games</span>
                        <div className="progress-bar">
                          <motion.div 
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${studentProgress && studentProgress[subject.key] ? studentProgress[subject.key].games : 0}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 1 }}
                          />
                        </div>
                        <span>{studentProgress && studentProgress[subject.key] ? studentProgress[subject.key].games : 0}%</span>
                      </div>
                      <div className="progress-item">
                        <span>Quizzes</span>
                        <div className="progress-bar">
                          <motion.div 
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${studentProgress && studentProgress[subject.key] ? studentProgress[subject.key].quizzes : 0}%` }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                          />
                        </div>
                        <span>{studentProgress && studentProgress[subject.key] ? studentProgress[subject.key].quizzes : 0}%</span>
                      </div>
                    </div>

                    <motion.button 
                      className="start-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Start button clicked for subject:', subject.key);
                        console.log('Current selectedClass:', selectedClass);
                        console.log('About to navigate to:', `/subject/${subject.key}`);
                        handleSubjectClick(subject.key);
                      }}
                      whileHover={{ y: -2, transition: { duration: 0.12, ease: 'easeOut' } }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.8 + index * 0.08, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Start Learning
                      </motion.span>
                      <motion.span
                        className="start-icon"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        🚀
                      </motion.span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Streak section removed as requested */}

            {/* Daily Challenge */}
            <motion.section
              className="vip-daily-challenge glass-card"
              id="daily-challenge"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="challenge-header">
                <div className="challenge-title">Daily Challenge</div>
                <div className="challenge-reward">+50 XP</div>
              </div>
              <p className="challenge-desc">Answer 3 quick questions to keep your streak alive!</p>
              {dailyDone && dailyScore !== null && (
                <div className="challenge-result" style={{ marginBottom: 12 }}>
                  You scored {dailyScore}/3 today. Great job!
                </div>
              )}
              {dailyActive ? (
                <>
                  <div className="daily-questions" style={{ marginTop: 12 }}>
                    {dailyQs.map((q, qi) => (
                      <div key={q.id} className="daily-question" style={{ marginBottom: 12 }}>
                        <div className="question-text" style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.q}</div>
                        <div className="choices" style={{ display: 'grid', gap: 8 }}>
                          {q.choices.map((choice, idx) => {
                            const selected = dailyAns[q.id] === idx;
                            return (
                              <button
                                key={idx}
                                className={`daily-choice ${selected ? 'selected' : ''}`}
                                onClick={() => setDailyAns(prev => ({ ...prev, [q.id]: idx }))}
                              >
                                <span className="choice-letter">{String.fromCharCode(65 + idx)}.</span>
                                <span className="choice-text">{choice}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="challenge-actions" style={{ marginTop: 8 }}>
                    <button
                      className="start-btn"
                      onClick={submitDaily}
                      disabled={dailyQs.some(q => dailyAns[q.id] === undefined)}
                    >
                      Submit Answers
                    </button>
                    <button
                      className="start-btn alt"
                      onClick={() => { setDailyActive(false); setDailyQs([]); setDailyAns({}); }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="challenge-actions">
                  <button
                    className="start-btn"
                    onClick={() => { handleDailyStart(); pushRecent('⚡','Started daily challenge'); }}
                    disabled={dailyDone}
                  >
                    {dailyDone ? 'Completed' : 'Start'}
                  </button>
                  <button className="start-btn alt" onClick={() => pushRecent('⏭️','Skipped daily challenge')}>Skip</button>
                </div>
              )}
            </motion.section>

            {/* Achievements Carousel */}
            <motion.section
              className="vip-achievements glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="achievements-title">Achievements</div>
              <div className="achievements-row">
                {['🎖️', '🏅', '🏆', '💎', '📚', '⚡'].map((a, i) => (
                  <div className="achievement-badge" key={i}>{a}</div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Link to="/achievements" className="start-btn alt">View All</Link>
              </div>
            </motion.section>

            {/* Recommendations */}
            <motion.section
              className="vip-recommend glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="recommend-title">Recommended Quests</div>
              <div className="recommend-grid">
                {[
                  { title: 'Algebra Basics', to: '/lesson/math' },
                  { title: 'Forces & Motion', to: '/lesson/science' },
                  { title: 'Fractions Mastery', to: '/lesson/math' },
                  { title: 'Circuits 101', to: '/lesson/science' }
                ].map((rec) => (
                  <Link className="recommend-card" to={rec.to} key={rec.title} onClick={() => pushRecent('🧭', `Started ${rec.title}`)}>{rec.title} →</Link>
                ))}
              </div>
            </motion.section>

            {/* Leaderboard Teaser */}
            <motion.section
              className="vip-leaderboard glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="leaderboard-title">Leaderboard</div>
              <div className="leaderboard-top">
                {[
                  { name: 'PlayerOne', xp: 1240 },
                  { name: 'NovaKid', xp: 1180 },
                  { name: 'MathMage', xp: 1100 }
                ].map((p, i) => (
                  <div className="leaderboard-item" key={p.name}>
                    <span className="lb-rank">#{i+1}</span>
                    <span className="lb-name">{p.name}</span>
                    <span className="lb-xp">{p.xp} XP</span>
                  </div>
                ))}
              </div>
              <Link to="/leaderboard" className="start-btn alt" style={{ marginTop: 12 }}>View Full Leaderboard</Link>
            </motion.section>
            {/* Badges System removed per request (Achievements has full page at /achievements) */}
          </motion.div>
        ) : (
          <motion.div
            key="teacher"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="teacher-section"
          >
            <motion.div 
              className="teacher-dashboard"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="teacher-header">
                <h2 className="section-title">Student Progress Reports</h2>
                <button 
                  className="refresh-button"
                  onClick={() => window.location.reload()}
                  title="Refresh student data"
                >
                  🔄 Refresh
                </button>
              </div>
              
              {studentsData.length === 0 ? (
                <div className="no-students-message">
                  <div className="no-students-icon">👥</div>
                  <h3>No Registered Students Yet</h3>
                  <p>Student progress reports will appear here once students register and start learning.</p>
                  <div className="no-students-stats">
                    <div className="stat-item">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Registered Students</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="students-grid">
                  {studentsData.map((student, index) => (
                  <motion.div
                    key={student.id}
                    className="student-card glass-card"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 15px 30px rgba(0,0,0,0.2)" 
                    }}
                  >
                    <div className="student-header">
                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>
                      <div className="student-info">
                        <h3>{student.name}</h3>
                        <span>Class {student.class}</span>
                      </div>
                    </div>
                    
                    <div className="student-subjects">
                      {subjects.map(subject => {
                        const subjectData = student[subject.key];
                        const avgScore = Math.round((subjectData.games + subjectData.quizzes) / 2);
                        return (
                          <div key={subject.key} className="subject-progress">
                            <div className="subject-header">
                              <span className="subject-icon">{subject.icon}</span>
                              <span className="subject-name">{subject.name}</span>
                              <span className={`badge ${subjectData.badge.toLowerCase()}`}>
                                {subjectData.badge}
                              </span>
                            </div>
                            <div className="scores">
                              <div className="score-item">
                                <span>Games: {subjectData.games}%</span>
                              </div>
                              <div className="score-item">
                                <span>Quizzes: {subjectData.quizzes}%</span>
                              </div>
                              <div className="score-item average">
                                <span>Average: {avgScore}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
                </div>
              )}
            </motion.div>
          </motion.div>
          <NetworkStatusIndicator />
          <div className="bottom-left-mask" />
        </div>
      );
    }
