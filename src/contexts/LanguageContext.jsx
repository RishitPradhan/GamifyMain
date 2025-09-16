import React, { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const defaultStrings = {
  en: {
    navbar: { features: 'Features', about: 'About', contact: 'Contact', welcome: 'Welcome', logout: 'Logout', login: 'Login', signup: 'Sign Up' },
    hero: { title: 'Play. Learn. Grow.', description: 'Interactive, gamified lessons for Math and Science.', exploreFeatures: 'Explore Features', getStarted: 'Get Started' },
    features: { title: 'Why Students Love It', subtitle: 'Designed to be fun, accessible, and effective.', interactiveGames: { title: 'Interactive Games', description: 'Learn by doing with mini-games and challenges.' }, multilingual: { title: 'Multilingual', description: 'Switch languages instantly for better understanding.' }, offlineAccess: { title: 'Offline Access', description: 'Use key features even when you are offline.' } },
    about: { title: 'About Gamify Learning', description: 'We bring playful, effective learning to every student.' },
    cta: { title: 'Ready to start learning?', description: 'Join thousands of learners boosting skills the fun way!', getStartedNow: 'Get Started Now' },
    footer: { copyright: '© 2025 Gamify Learning', privacy: 'Privacy', terms: 'Terms' },
  },
};

const languagesList = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const t = (path) => {
    const parts = String(path).split('.');
    let node = defaultStrings[currentLanguage] || defaultStrings.en;
    for (const p of parts) {
      if (node && typeof node === 'object' && p in node) node = node[p];
      else return path; // fallback to key
    }
    return typeof node === 'string' ? node : path;
  };

  const changeLanguage = (code) => {
    setCurrentLanguage(code);
  };

  const value = useMemo(() => ({
    t,
    currentLanguage,
    changeLanguage,
    languages: languagesList,
  }), [currentLanguage]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
