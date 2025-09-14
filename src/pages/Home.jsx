import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import NetworkStatusIndicator from "../components/NetworkStatusIndicator";
import './Home.css';

export default function Home() {
  const [selectedClass, setSelectedClass] = useState("8");
  const [activeSection, setActiveSection] = useState("student");
  const { user } = useAuth();
  const { studentProgress, loading, getBadge, isNewUser } = useProgress();
  
  const navigate = useNavigate();

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
      description: "Discover the secrets of the universe through experiments!",
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
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="dashboard-title">
          <span className="gradient-text">Gamify Dashboard</span>
        </h1>
        
        {/* User Welcome Section */}
        {user && (
          <motion.div 
            className="user-welcome simple-welcome"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="user-name">{user.user_metadata?.full_name || user.email || 'Player'}</span>
          </motion.div>
        )}
        

      </motion.header>

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
                    style={{ background: subject.gradient }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                    whileTap={{ scale: 0.98 }}
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

            {/* Badges System */}
            <motion.div 
              className="badges-section glass-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="section-title">Your Achievements</h2>
              <div className="badges-container">
                {subjects.map((subject, index) => {
                  const badge = studentProgress && studentProgress[subject.key] ? getBadge(studentProgress[subject.key]) : { name: "None", color: "#gray", icon: "⭕" };
                  return (
                    <motion.div
                      key={subject.key}
                      className="badge-item"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.6, type: "spring" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="badge-icon" style={{ color: badge.color }}>
                        {badge.icon}
                      </div>
                      <div className="badge-info">
                        <h4>{subject.name}</h4>
                        <span className="badge-name" style={{ color: badge.color }}>
                          {badge.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
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
        </div>
      );
    }
