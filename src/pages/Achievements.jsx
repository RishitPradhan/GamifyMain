import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import './Achievements.css';

// Helper to safely read/write localStorage JSON
const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};
const writeJSON = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export default function Achievements() {
  const { user } = useAuth();
  const { studentProgress } = useProgress();

  const progressKey = useMemo(() => {
    if (user?.email) return `student_progress_${user.email}`;
    const keys = Object.keys(localStorage).filter(k => k.startsWith('student_progress_'));
    return keys[0] || null;
  }, [user?.email]);

  // Determine current user's progress from context or localStorage
  const progress = useMemo(() => {
    if (studentProgress) return studentProgress;
    // Fallback: find first student_progress_* key
    if (progressKey) return readJSON(progressKey, {});
    return {};
  }, [studentProgress, progressKey]);

  const totalGames = (progress.science?.games || 0) + (progress.technology?.games || 0) + (progress.mathematics?.games || 0);
  const totalQuizzes = (progress.science?.quizzes || 0) + (progress.technology?.quizzes || 0) + (progress.mathematics?.quizzes || 0);
  const streak = progress.streak || 0;

  // Badges with thresholds + progress
  const qMath = progress.mathematics?.quizzes || 0;
  const qSci = progress.science?.quizzes || 0;
  const badges = [
    { id: 'starter', name: 'Getting Started', icon: '🎯', earned: totalGames + totalQuizzes > 0, current: totalGames + totalQuizzes, target: 1 },
    { id: 'quiz-novice', name: 'Quiz Novice', icon: '📝', earned: totalQuizzes >= 3, current: totalQuizzes, target: 3 },
    { id: 'quiz-master', name: 'Quiz Master', icon: '🏆', earned: totalQuizzes >= 10, current: totalQuizzes, target: 10 },
    { id: 'game-novice', name: 'Game Novice', icon: '🎮', earned: totalGames >= 3, current: totalGames, target: 3 },
    { id: 'streak-3', name: '3-Day Streak', icon: '🔥', earned: streak >= 3, current: streak, target: 3 },
    { id: 'streak-7', name: '7-Day Streak', icon: '⚡', earned: streak >= 7, current: streak, target: 7 },
    { id: 'math-ace', name: 'Math Ace', icon: '➗', earned: qMath >= 5, current: qMath, target: 5 },
    { id: 'science-ace', name: 'Science Ace', icon: '🔬', earned: qSci >= 5, current: qSci, target: 5 },
  ];

  const recentKey = progressKey ? `ach_recent_${progressKey.replace('student_progress_','')}` : null;
  const recentLS = recentKey ? readJSON(recentKey, []) : [];
  const recent = ([
    streak > 0 && { icon: '🔥', text: `Current streak: ${streak} day${streak===1?'':'s'}` },
    totalQuizzes > 0 && { icon: '📝', text: `Completed ${totalQuizzes} quiz${totalQuizzes===1?'':'zes'}` },
    totalGames > 0 && { icon: '🎮', text: `Played ${totalGames} game${totalGames===1?'':'s'}` },
  ].filter(Boolean)).concat(recentLS).slice(0, 20);

  return (
    <div className="ach-page">
      <div className="ach-container">
        <motion.h1 className="ach-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Your Achievements</motion.h1>

        {/* Progress Summary */}
        <motion.div className="ach-summary glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="ach-stat"><span className="ach-stat-label">Games</span><span className="ach-stat-value">{totalGames}</span></div>
          <div className="ach-stat"><span className="ach-stat-label">Quizzes</span><span className="ach-stat-value">{totalQuizzes}</span></div>
          <div className="ach-stat"><span className="ach-stat-label">Streak</span><span className="ach-stat-value">{streak}🔥</span></div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="ach-recent glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="ach-section-title">Recent</div>
          <div className="ach-recent-list">
            {recent.length === 0 ? <div className="ach-empty">No activity yet. Start learning to earn badges!</div> : recent.map((r, i) => (
              <div className="ach-recent-item" key={i}><span className="ach-recent-icon">{r.icon}</span>{r.text}</div>
            ))}
          </div>
        </motion.div>

        {/* Badges Grid */}
        <motion.div className="ach-grid glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="ach-section-title">Badges</div>
          <div className="ach-badges">
            {badges.map(b => (
              <div className={`ach-badge ${b.earned ? 'earned' : 'locked'}`} key={b.id}>
                <div className="ach-badge-icon">{b.icon}</div>
                <div className="ach-badge-name">{b.name}</div>
                {b.target ? (
                  <div className="ach-progress">
                    <div className="ach-progress-bar">
                      <div className="ach-progress-fill" style={{ width: `${Math.min(100, Math.round((b.current||0)/b.target*100))}%` }} />
                    </div>
                    <div className="ach-progress-text">{Math.min(b.current||0, b.target)} / {b.target}</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
