import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Rewards.css";

const readJSON = (k, f = null) => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : f; } catch { return f; }
};

export default function Rewards() {
  const userEmail = localStorage.getItem('current_user_email');
  const progressKey = userEmail ? `student_progress_${userEmail}` : (() => {
    for (let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if (k && k.startsWith('student_progress_')) return k; }
    return null;
  })();

  const [balance, setBalance] = useState(() => readJSON(progressKey, {})?.totalXP || 0);
  const [streak] = useState(() => readJSON(progressKey, {})?.streak || 0);

  const items = useMemo(() => ([
    { id: 'hint-pack', name: 'Hint Pack', cost: 80, icon: '💡', desc: 'Unlock 5 helpful hints.' },
    { id: 'double-xp-1h', name: 'Double XP (1h)', cost: 150, icon: '⚡', desc: '2x XP for one hour.' },
    { id: 'avatar-frame', name: 'Avatar Frame', cost: 120, icon: '🖼️', desc: 'Shiny avatar border.' },
    { id: 'theme-cyan', name: 'Cyan Theme', cost: 200, icon: '🎨', desc: 'Unlock cyan accent theme.' },
  ]), []);

  const writeProgress = (obj) => { if (!progressKey) return; localStorage.setItem(progressKey, JSON.stringify(obj)); };

  const pushRecent = (text) => {
    if (!progressKey) return;
    const key = `ach_recent_${(progressKey||'').replace('student_progress_','')}`;
    try { const arr = readJSON(key, []); arr.unshift({ icon: '🎁', text, ts: Date.now() }); localStorage.setItem(key, JSON.stringify(arr.slice(0,20))); } catch {}
  };

  const handleRedeem = (item) => {
    const p = readJSON(progressKey, {});
    const current = p.totalXP || 0;
    if (current < item.cost) return;
    const newP = { ...p, totalXP: current - item.cost };
    writeProgress(newP);
    setBalance(current - item.cost);
    pushRecent(`Redeemed ${item.name} (-${item.cost} XP)`);
  };

  return (
    <div className="rewards-page">
      <div className="rewards-container">
        <motion.h1 className="rewards-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          Rewards Store
        </motion.h1>

        <motion.div className="rewards-summary glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="summary-card">
            <div className="summary-label">XP Balance</div>
            <div className="summary-value">{balance} XP</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Daily Streak</div>
            <div className="summary-value">{streak} 🔥</div>
          </div>
          <div className="summary-actions">
            <Link to="/home" className="start-btn alt">Back Home</Link>
          </div>
        </motion.div>

        <motion.div className="rewards-grid glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {items.map((it) => (
            <div className="reward-item" key={it.id}>
              <div className="reward-icon">{it.icon}</div>
              <div className="reward-name">{it.name}</div>
              <div className="reward-desc">{it.desc}</div>
              <div className="reward-bottom">
                <div className="reward-cost">{it.cost} XP</div>
                <button className="start-btn" disabled={balance < it.cost} onClick={() => handleRedeem(it)}>
                  {balance < it.cost ? 'Not enough XP' : 'Redeem'}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
