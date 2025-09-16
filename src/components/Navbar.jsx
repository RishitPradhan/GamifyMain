import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TranslatorWidget from "./TranslatorWidget";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  return (
    <header className="app-navbar">
      <div className="nav-inner">
        <Link to="/home" className="brand" aria-label="Home">
          <span className="brand-text">GAMIFY</span>
        </Link>

        <nav className="links" aria-label="Primary">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Teacher</Link>
        </nav>

        <div className="nav-actions">
          <TranslatorWidget />
          <Link to="/profile" className="profile-btn" aria-label="Profile">
            <span className="avatar" aria-hidden>👤</span>
            <span className="profile-text">Profile</span>
          </Link>
          <button
            className="logout-btn"
            title="Logout"
            onClick={async () => {
              try {
                await signOut();
              } finally {
                navigate('/login');
              }
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
