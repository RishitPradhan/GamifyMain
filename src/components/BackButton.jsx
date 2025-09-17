import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenOn = new Set(['/','/home']);
  const noHistory = typeof window !== 'undefined' && window.history ? window.history.length <= 1 : false;
  if (hiddenOn.has(location.pathname) || noHistory) return null;

  return (
    <button
      className="pixel-back-btn"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      type="button"
    >
      <span className="pixel-back-glyph">⟵</span>
      <span className="pixel-back-label">{label}</span>
    </button>
  );
}
