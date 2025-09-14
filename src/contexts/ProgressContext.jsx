import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'student_progress';

export function ProgressProvider({ children }) {
  const [studentProgress, setStudentProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStudentProgress(JSON.parse(raw));
    } catch {}
    // small async tick so consumers can show a loading shimmer
    const t = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(studentProgress));
    } catch {}
  }, [studentProgress]);

  const updateProgress = (subjectKey, partial) => {
    setStudentProgress((prev) => {
      const curr = prev[subjectKey] || { games: 0, quizzes: 0 };
      const next = { ...prev, [subjectKey]: { ...curr, ...partial } };
      return next;
    });
  };

  // Badge helper expected by Home.jsx: returns { name, color, icon }
  const getBadge = (progress) => {
    const games = Math.max(0, Math.min(100, Number(progress?.games ?? 0)));
    const quizzes = Math.max(0, Math.min(100, Number(progress?.quizzes ?? 0)));
    const avg = (games + quizzes) / 2;
    if (avg >= 80) return { name: 'Gold', color: '#fbbf24', icon: '🏆' };
    if (avg >= 60) return { name: 'Silver', color: '#9ca3af', icon: '🥈' };
    if (avg >= 30) return { name: 'Bronze', color: '#b45309', icon: '🥉' };
    return { name: 'Starter', color: '#a78bfa', icon: '🎓' };
  };

  // Determine if the current user appears new (no subject progress yet)
  const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
  const isNewUser = isEmpty(studentProgress) || ['science','technology','mathematics']
    .every(k => !studentProgress[k] || ((studentProgress[k].games||0)+(studentProgress[k].quizzes||0)) === 0);

  const value = useMemo(() => ({ 
    studentProgress, 
    updateProgress, 
    loading, 
    getBadge, 
    isNewUser,
  }), [studentProgress, loading, isNewUser]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
