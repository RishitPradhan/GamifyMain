import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function TeacherHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Teacher';

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      <div aria-hidden style={{ position:'absolute', inset:0, zIndex:0, background:
        'radial-gradient(1200px 600px at -10% -10%, rgba(124,58,237,0.24), transparent),\
         radial-gradient(1000px 600px at 110% 0%, rgba(244,114,182,0.22), transparent),\
         radial-gradient(900px 700px at 50% 120%, rgba(124,58,237,0.16), transparent),\
         #0b1220' }} />
    <div className="container" style={{ padding: 16, position:'relative', zIndex:1 }}>
      {/* Header */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: 16, marginBottom: 16, background:'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(244,114,182,0.22))', border:'1px solid rgba(124,58,237,0.30)', color:'#fff' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0 }}>👩‍🏫 Welcome, {name}</h2>
            <div style={{ opacity: 0.8 }}>Your teacher workspace</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/qna" className="btn" style={{ background:'linear-gradient(135deg,#7c3aed,#f472b6)', color:'#fff', border:'none' }}>💬 Community Q&A</Link>
            <Link to="/dashboard" className="btn" style={{ background:'linear-gradient(135deg,#f472b6,#7c3aed)', color:'#fff', border:'none' }}>📊 Teacher Dashboard</Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ padding: 16, background:'linear-gradient(180deg, rgba(124,58,237,0.12), rgba(244,114,182,0.10))', border:'1px solid rgba(124,58,237,0.24)', color:'#fff' }}>
          <h3 style={{ marginTop: 0 }}>Create Quiz</h3>
          <p style={{ opacity: 0.85 }}>Build engaging quizzes for your class and track performance.</p>
          <button className="btn" onClick={() => navigate('/dashboard')} style={{ background:'linear-gradient(135deg,#7c3aed,#f472b6)', color:'#fff', border:'none' }}>Open Dashboard</button>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ padding: 16, background:'linear-gradient(180deg, rgba(124,58,237,0.12), rgba(244,114,182,0.10))', border:'1px solid rgba(124,58,237,0.24)', color:'#fff' }}>
          <h3 style={{ marginTop: 0 }}>Manage Q&A</h3>
          <p style={{ opacity: 0.85 }}>Help students in the community Q&A by answering questions.</p>
          <button className="btn" onClick={() => navigate('/qna')} style={{ background:'linear-gradient(135deg,#f472b6,#7c3aed)', color:'#fff', border:'none' }}>Go to Q&A</button>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ padding: 16, background:'linear-gradient(180deg, rgba(124,58,237,0.12), rgba(244,114,182,0.10))', border:'1px solid rgba(124,58,237,0.24)', color:'#fff' }}>
          <h3 style={{ marginTop: 0 }}>Share Materials</h3>
          <p style={{ opacity: 0.85 }}>Upload notes or PYQs via dashboard for your students.</p>
          <button className="btn" onClick={() => navigate('/dashboard')} style={{ background:'linear-gradient(135deg,#7c3aed,#f472b6)', color:'#fff', border:'none' }}>Upload</button>
        </motion.div>
      </div>
    </div>
    </div>
  );
}
