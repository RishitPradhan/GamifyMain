import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import './Leaderboard.css';

const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

function calcXP(progress) {
  if (!progress) return 0;
  const subjects = ['science', 'technology', 'mathematics'];
  let games = 0, quizzes = 0;
  subjects.forEach(s => {
    games += progress[s]?.games || 0;
    quizzes += progress[s]?.quizzes || 0;
  });
  const streak = progress.streak || 0;
  // Simple XP model: games 15, quizzes 25, streak 20 each
  return games * 15 + quizzes * 25 + streak * 20;
}

export default function Leaderboard() {
  const [selectedClass, setSelectedClass] = useState('All');
  const allPlayers = useMemo(() => {
    const data = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('student_progress_')) {
        const userKey = key.replace('student_progress_', '');
        const p = readJSON(key, {});
        const xp = calcXP(p);
        // derive a display name if available
        const userInfo = readJSON(`user_${userKey}`, null);
        const name = userInfo?.displayName || userInfo?.name || userKey.split('@')[0];
        const klass = userInfo?.class || userInfo?.grade || p?.class || 'Unknown';
        data.push({ name, xp, klass, key: userKey });
      }
    }
    return data.sort((a, b) => b.xp - a.xp);
  }, []);

  const classes = useMemo(() => {
    const set = new Set(['All']);
    allPlayers.forEach(p => set.add(String(p.klass)));
    return Array.from(set);
  }, [allPlayers]);

  const players = useMemo(() => {
    const filtered = selectedClass === 'All' ? allPlayers : allPlayers.filter(p => String(p.klass) === String(selectedClass));
    return filtered.slice(0, 50);
  }, [allPlayers, selectedClass]);

  return (
    <div className="lb-page">
      <div className="lb-container">
        <motion.h1 className="lb-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Leaderboard</motion.h1>
        <div className="lb-controls">
          <label className="lb-filter-label">Class</label>
          <select className="lb-filter" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <motion.div className="lb-board glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="lb-header">
            <span>#</span>
            <span>Player</span>
            <span>XP</span>
          </div>
          <div className="lb-rows">
            {players.length === 0 ? (
              <div className="lb-empty">No players yet. Start learning to climb the ranks!</div>
            ) : players.map((p, i) => (
              <div className={`lb-row ${i < 3 ? 'top' : ''} ${p.key && localStorage.getItem('current_user_email') && p.key === localStorage.getItem('current_user_email') ? 'me' : ''}`} key={p.name}>
                <span className="lb-rank">{i + 1}</span>
                <span className="lb-name">{p.name} {p.klass && p.klass !== 'Unknown' ? <span className="lb-class">(Class {p.klass})</span> : null}</span>
                <span className="lb-xp">{p.xp}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
