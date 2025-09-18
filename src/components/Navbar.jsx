import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TranslatorWidget from "./TranslatorWidget";
import BackButton from "./BackButton";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const resolveHomePath = () => {
    const role = user?.user_metadata?.role || (function(){
      try { return JSON.parse(localStorage.getItem('demo_user')||'null')?.user_metadata?.role } catch { return null; }
    })() || 'student';
    return role === 'teacher' ? '/teacher-home' : '/home';
  };
  const homePath = resolveHomePath();
  return (
    <header className="app-navbar">
      <div className="nav-inner">
        <Link to={homePath} className="brand" aria-label="Home" onClick={(e)=>{ e.preventDefault(); navigate(resolveHomePath()); }}>
          <span className="brand-text">Gamify</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <NavLink
            to={homePath}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            end
            onClick={(e) => {
              e.preventDefault();
              navigate(resolveHomePath());
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Teacher
          </NavLink>
        </nav>

        <div className="nav-actions">
          <BackButton />
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
