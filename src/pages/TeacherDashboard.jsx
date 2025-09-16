import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { loadLocalProgress } from "../stores/localProgress";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const [remoteProgress, setRemoteProgress] = useState([]);
  const [local, setLocal] = useState({});
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    setLocal(loadLocalProgress());

    // Fetch remote progress if Supabase is configured
    if (supabase) {
      (async () => {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) console.warn("Supabase fetch error", error);
        else {
          setRemoteProgress(data || []);
          setLastSync(new Date().toLocaleString());
        }
      })();
    }
  }, []);

  const localEntries = Object.keys(local || {}).length;
  const remoteEntries = (remoteProgress || []).length;
  const supaConfigured = !!supabase;

  // Try to normalize different saved shapes into a list of entries
  // Normalized entry: { topic, score, timestamp }
  function normalizeProgress(progress) {
    if (!progress) return [];
    // Case 1: already an array of entries
    if (Array.isArray(progress)) {
      return progress.map((e) => ({
        topic: e.topic ?? e.chapter ?? e.title ?? "(unknown)",
        score: e.score ?? e.points ?? e.xp ?? 0,
        timestamp: e.timestamp ?? e.created_at ?? e.date ?? null,
      }));
    }
    // Case 2: object with entries array
    if (Array.isArray(progress.entries)) {
      return progress.entries.map((e) => ({
        topic: e.topic ?? e.chapter ?? e.title ?? "(unknown)",
        score: e.score ?? e.points ?? e.xp ?? 0,
        timestamp: e.timestamp ?? e.created_at ?? e.date ?? null,
      }));
    }
    // Case 3: topics keyed object, e.g. { "Math: Squares": { score, timestamp } }
    if (typeof progress === 'object') {
      return Object.entries(progress).map(([k, v]) => ({
        topic: k,
        score: v ? (v.score ?? v.points ?? v.xp ?? 0) : 0,
        timestamp: v ? (v.timestamp ?? v.created_at ?? v.date ?? null) : null,
      }));
    }
    return [];
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-title">
          <h1><span className="gradient-text">Teacher Dashboard</span></h1>
          <p className="dash-subtitle">Track student progress, jump into lessons, and manage your class — all in one place.</p>
        </div>
        <div className="dash-actions">
          <Link to="/lesson/math" className="dash-btn primary">📐 Math</Link>
          <Link to="/lesson/science" className="dash-btn">🔬 Science</Link>
          <Link to="/profile" className="dash-btn ghost">👤 Profile</Link>
        </div>
      </header>

      {/* Stats */}
      <section className="dash-grid">
        <div className="stat-card">
          <div className="stat-label">Local entries</div>
          <div className="stat-value">{localEntries}</div>
          <div className="stat-foot">Device cache</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Remote entries</div>
          <div className="stat-value">{remoteEntries}</div>
          <div className="stat-foot">Supabase {supaConfigured ? (lastSync ? `• synced ${lastSync}` : "• connected") : "• not configured"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Theme</div>
          <div className="stat-value">Neon</div>
          <div className="stat-foot">Optimized UI</div>
        </div>
      </section>

      {/* Quick links */}
      <section className="quick-grid">
        <Link to="/lesson/math" className="quick-card">
          <div className="qc-emoji">🧮</div>
          <div>
            <div className="qc-title">Math Lessons</div>
            <div className="qc-sub">Numbers, Algebra, Geometry</div>
          </div>
        </Link>
        <Link to="/lesson/science" className="quick-card">
          <div className="qc-emoji">🧪</div>
          <div>
            <div className="qc-title">Science Lessons</div>
            <div className="qc-sub">Physics, Chemistry, Biology</div>
          </div>
        </Link>
        <Link to="/profile" className="quick-card">
          <div className="qc-emoji">👨‍🏫</div>
          <div>
            <div className="qc-title">Your Profile</div>
            <div className="qc-sub">Manage account & progress</div>
          </div>
        </Link>
      </section>

      {/* Remote progress */}
      <section className="card-glass">
        <h3 className="section-title">Remote progress (Supabase)</h3>
        {supaConfigured ? (
          remoteProgress.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {remoteProgress.map((r, i) => (
                    <tr key={i}>
                      <td>{r.student_id}</td>
                      <td>{r.topic}</td>
                      <td>{r.score}</td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No remote progress found</p>
          )
        ) : (
          <p className="muted">Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env</p>
        )}
      </section>
    </div>
  );
}
