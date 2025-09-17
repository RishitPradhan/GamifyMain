import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'student_progress';

export function ProgressProvider({ children }) {
  const [studentProgress, setStudentProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [firstHydrate, setFirstHydrate] = useState(true);
  const { user, isSupabaseConfigured } = useAuth();

  // Initial hydrate: prefer Supabase when configured and user exists; otherwise fallback to localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured && user) {
          const { data, error } = await supabase
            .from('student_progress')
            .select('data')
            .eq('user_id', user.id)
            .single();
          if (!cancelled) {
            if (error && error.code !== 'PGRST116') {
              console.warn('Failed to load progress from DB:', error.message);
            }
            if (data?.data) {
              setStudentProgress(data.data || {});
            } else {
              // no row yet; start empty
              setStudentProgress({});
            }
          }
        } else {
          // Demo/local mode
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setStudentProgress(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Progress hydrate error:', e.message);
      } finally {
        if (!cancelled) setLoading(false);
        setFirstHydrate(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isSupabaseConfigured, user]);

  // Persist changes: Supabase when available, otherwise localStorage
  useEffect(() => {
    if (firstHydrate) return; // avoid writing back immediately on first load
    (async () => {
      try {
        if (isSupabaseConfigured && user) {
          const payload = { user_id: user.id, data: studentProgress };
          const { error } = await supabase
            .from('student_progress')
            .upsert(payload, { onConflict: 'user_id' });
          if (error) console.warn('Failed to persist progress to DB:', error.message);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(studentProgress));
        }
      } catch (e) {
        console.warn('Persist progress error:', e.message);
      }
    })();
  }, [studentProgress, isSupabaseConfigured, user, firstHydrate]);

  const updateProgress = (subjectKey, partial) => {
    setStudentProgress((prev) => {
      const curr = prev[subjectKey] || { games: 0, quizzes: 0 };
      const next = { ...prev, [subjectKey]: { ...curr, ...partial } };
      return next;
    });
  };

  // Update root-level meta fields like totalXP, streak, lastClaimDate, dailyGoalXP
  const setMeta = (partial) => {
    setStudentProgress((prev) => ({ ...prev, ...partial }));
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
    setMeta,
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
