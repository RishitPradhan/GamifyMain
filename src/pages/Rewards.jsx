import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../contexts/ProgressContext";
import "./Rewards.css";

const readJSON = (k, f = null) => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : f; } catch { return f; }
};

export default function Rewards() {
  const { studentProgress, setMeta } = useProgress();
  // Mirror Home.jsx canonical XP computation so Rewards shows the same total XP
  const calcXP = (progress) => {
    if (!progress) return 0;
    const subjects = ['science', 'technology', 'mathematics'];
    let games = 0, quizzes = 0;
    subjects.forEach(s => {
      games += progress[s]?.games || 0;
      quizzes += progress[s]?.quizzes || 0;
    });
    const streakVal = progress.streak || 0;
    return games * 15 + quizzes * 25 + streakVal * 20;
  };
  const computedTotalXP = useMemo(() => calcXP(studentProgress || {}), [studentProgress]);
  const xpSpent = Number(studentProgress?.xpSpent || 0);
  const balance = Math.max(0, computedTotalXP - xpSpent);
  const streak = Number(studentProgress?.streak || 0);

  const items = useMemo(() => ([
    { id: 'hint-pack', name: 'Hint Pack', cost: 80, icon: '💡', desc: 'Unlock 5 helpful hints.', type: 'consumable' },
    { id: 'double-xp-1h', name: 'Double XP (1h)', cost: 150, icon: '⚡', desc: '2x XP for one hour (demo only).', type: 'boost', durationMs: 60*60*1000 },
    { id: 'avatar-frame', name: 'Avatar Frame', cost: 120, icon: '🖼️', desc: 'Shiny avatar border.', type: 'cosmetic', slot: 'frame' },
    { id: 'theme-cyan', name: 'Cyan Theme', cost: 200, icon: '🎨', desc: 'Unlock cyan accent theme.', type: 'cosmetic', slot: 'theme', value: 'cyan' },
    { id: 'profile-icon-pack', name: 'Icon Pack', cost: 90, icon: '🎯', desc: '5 new profile icons.', type: 'cosmetic', slot: 'icons', value: 'pack1' },
    { id: 'name-glow', name: 'Name Glow', cost: 140, icon: '✨', desc: 'Adds a glow to your name.', type: 'cosmetic', slot: 'nameGlow', value: true },
    { id: 'bg-motif', name: 'BG Motif', cost: 160, icon: '🌈', desc: 'Unlock a subtle background motif.', type: 'cosmetic', slot: 'bg', value: 'motif1' },
  ]), []);

  const pushRecent = (text) => {
    try {
      const key = 'ach_recent_global';
      const arr = readJSON(key, []);
      arr.unshift({ icon: '🎁', text, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 20)));
    } catch {}
  };

  const [redeemingId, setRedeemingId] = useState(null);
  const handleRedeem = async (item) => {
    if (balance < item.cost) return;
    setRedeemingId(item.id);
    try {
      const now = Date.now();
      const already = Array.isArray(studentProgress?.redeemed) ? studentProgress.redeemed : [];
      const nextBase = { xpSpent: xpSpent + item.cost, redeemed: [...already, { id: item.id, at: now }] };

      // Apply side effects based on item type
      const settings = { ...(studentProgress?.settings || {}) };
      const boosts = Array.isArray(studentProgress?.boosts) ? studentProgress.boosts : [];
      let hints = Number(studentProgress?.hints || 0);
      if (item.type === 'consumable' && item.id === 'hint-pack') {
        hints += 5;
      }
      if (item.type === 'boost' && item.id === 'double-xp-1h') {
        const expiresAt = now + (item.durationMs || 0);
        boosts.push({ id: item.id, expiresAt });
      }
      if (item.type === 'cosmetic') {
        // Ownable cosmetic; mark owned and auto-equip
        settings.owned = Array.isArray(settings.owned) ? settings.owned : [];
        if (!settings.owned.includes(item.id)) settings.owned.push(item.id);
        if (item.slot === 'theme') settings.theme = item.value;
        else if (item.slot === 'frame') settings.frame = true;
        else if (item.slot === 'icons') settings.iconPack = item.value;
        else if (item.slot === 'nameGlow') settings.nameGlow = true;
        else if (item.slot === 'bg') settings.backgroundMotif = item.value;
      }

      setMeta({ ...nextBase, settings, boosts, hints });
      pushRecent(`Redeemed ${item.name} (-${item.cost} XP)`);
    } finally {
      setRedeemingId(null);
    }
  };

  const isOwned = (id) => Array.isArray(studentProgress?.settings?.owned) && studentProgress.settings.owned.includes(id);
  const isEquipped = (item) => {
    const s = studentProgress?.settings || {};
    if (item.slot === 'theme') return s.theme === item.value;
    if (item.slot === 'frame') return !!s.frame;
    if (item.slot === 'icons') return s.iconPack === item.value;
    if (item.slot === 'nameGlow') return !!s.nameGlow;
    if (item.slot === 'bg') return s.backgroundMotif === item.value;
    return false;
  };
  const handleEquip = (item) => {
    if (!isOwned(item.id)) return;
    const s = { ...(studentProgress?.settings || {}) };
    if (item.slot === 'theme') s.theme = item.value;
    if (item.slot === 'frame') s.frame = true;
    if (item.slot === 'icons') s.iconPack = item.value;
    if (item.slot === 'nameGlow') s.nameGlow = true;
    if (item.slot === 'bg') s.backgroundMotif = item.value;
    setMeta({ settings: s });
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
                {it.type === 'cosmetic' ? (
                  isOwned(it.id) ? (
                    <button className="start-btn redeem-btn" onClick={() => handleEquip(it)} disabled={isEquipped(it)}>
                      {isEquipped(it) ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button className="start-btn redeem-btn" disabled={balance < it.cost || redeemingId === it.id} onClick={() => handleRedeem(it)}>
                      {redeemingId === it.id ? 'Redeeming...' : balance < it.cost ? 'Not enough XP' : 'Redeem'}
                    </button>
                  )
                ) : (
                  <button className="start-btn redeem-btn" disabled={balance < it.cost || redeemingId === it.id} onClick={() => handleRedeem(it)}>
                    {redeemingId === it.id ? 'Redeeming...' : balance < it.cost ? 'Not enough XP' : 'Redeem'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
