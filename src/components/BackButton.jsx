import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.user_metadata?.role || 'student';

  const hiddenOn = new Set(['/','/home','/teacher-home']);
  const noHistory = typeof window !== 'undefined' && window.history ? window.history.length <= 1 : false;
  if (hiddenOn.has(location.pathname) || noHistory) return null;

  return (
    <button
      className="pixel-back-btn"
      onClick={() => {
        if (role === 'teacher') navigate('/teacher-home');
        else navigate(-1);
      }}
      aria-label="Go back"
      type="button"
    >
      <span className="pixel-back-glyph">⟵</span>
      <span className="pixel-back-label">{label}</span>
    </button>
  );
}
