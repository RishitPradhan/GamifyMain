import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isSupabaseConfigured = !!supabase;

  // Restore user from localStorage (demo mode persistence)
  useEffect(() => {
    const saved = localStorage.getItem('demo_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => { sub.subscription?.unsubscribe?.(); };
    }
  }, []);

  const isAuthenticated = !!user;

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      // Demo mode: accept any credentials
      const demo = { id: 'demo-user', email, user_metadata: { full_name: 'Demo Student' } };
      setUser(demo);
      localStorage.setItem('demo_user', JSON.stringify(demo));
      return { success: true, user: demo };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      const demo = { id: 'demo-user', email, user_metadata: { full_name: fullName } };
      setUser(demo);
      localStorage.setItem('demo_user', JSON.stringify(demo));
      return { success: true, user: demo };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) return { success: false, error: error.message };
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('demo_user');
      setUser(null);
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
  }), [user, isSupabaseConfigured]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
