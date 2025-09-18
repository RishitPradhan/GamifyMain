import React, { useEffect, useMemo, useState } from 'react';
import './QnA.css';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function QnA() {
  const { user, isSupabaseConfigured } = useAuth();
  // Theme accents
  const ACCENT = '#7c3aed'; // violet
  const ACCENT_2 = '#f472b6'; // pink
  const CARD_BG = 'linear-gradient(180deg, rgba(124,58,237,0.12), rgba(244,114,182,0.10))';
  const HEADER_BG = 'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(244,114,182,0.22))';
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qForm, setQForm] = useState({ title: '', body: '', subject: '' });
  const [aForm, setAForm] = useState({ body: '' });
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState('');

  const canPost = !!user && isSupabaseConfigured;

  // Force a themed background on the body for this page to avoid any white fallback
  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;
      const prevBackground = document.body.style.background;
      const prevBgImage = document.body.style.backgroundImage;
      const prevBgColor = document.body.style.backgroundColor;
      const prevBgAttachment = document.body.style.backgroundAttachment;
      document.body.style.background = `
        radial-gradient(1200px 600px at -10% -10%, rgba(124,58,237,0.24), transparent),
        radial-gradient(1000px 600px at 110% 0%, rgba(244,114,182,0.22), transparent),
        radial-gradient(900px 700px at 50% 120%, rgba(124,58,237,0.16), transparent),
        #0b1220
      `;
      document.body.style.backgroundAttachment = 'fixed';
      return () => {
        try {
          document.body.style.background = prevBackground;
          document.body.style.backgroundImage = prevBgImage;
          document.body.style.backgroundColor = prevBgColor;
          document.body.style.backgroundAttachment = prevBgAttachment;
        } catch {}
      };
    } catch {}
  }, []);

  const loadQuestions = async () => {
    if (!isSupabaseConfigured || !supabase) { setLoadingList(false); return; }
    setLoadingList(true);
    const { data, error } = await supabase
      .from('qna_questions')
      .select('id, user_id, title, body, subject, answers_count, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) setQuestions(data || []);
    setLoadingList(false);
  };

  const loadAnswers = async (question_id) => {
    if (!isSupabaseConfigured || !supabase || !question_id) return;
    const { data, error } = await supabase
      .from('qna_answers')
      .select('id, user_id, body, created_at')
      .eq('question_id', question_id)
      .order('created_at', { ascending: true });
    if (!error) setSelected((s) => s ? { ...s, answers: data || [] } : s);
  };

  useEffect(() => {
    loadQuestions();
    let ch1, ch2;
    if (isSupabaseConfigured && supabase) {
      ch1 = supabase
        .channel('qna-questions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'qna_questions' }, () => loadQuestions())
        .subscribe();
      ch2 = supabase
        .channel('qna-answers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'qna_answers' }, (payload) => {
          const qid = payload.new?.question_id || payload.old?.question_id;
          if (qid && selected?.id === qid) loadAnswers(qid);
        })
        .subscribe();
    }
    return () => {
      if (ch1) supabase.removeChannel(ch1);
      if (ch2) supabase.removeChannel(ch2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabaseConfigured, user, selected?.id]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return (questions || []).filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.body?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q)
    );
  }, [questions, search]);

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!canPost) return alert('Please sign in to post.');
    if (!qForm.title.trim() || !qForm.body.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('qna_questions').insert({
        user_id: user.id,
        title: qForm.title.trim(),
        body: qForm.body.trim(),
        subject: qForm.subject?.trim() || null,
      });
      if (error) throw error;
      setQForm({ title: '', body: '', subject: '' });
      await loadQuestions();
    } catch (e) {
      console.warn('Post question failed:', e.message);
      alert('Failed to post question.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!canPost) return alert('Please sign in to answer.');
    if (!selected?.id || !aForm.body.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('qna_answers').insert({
        question_id: selected.id,
        user_id: user.id,
        body: aForm.body.trim(),
      });
      if (error) throw error;
      setAForm({ body: '' });
      await loadAnswers(selected.id);
      await loadQuestions(); // refresh counts
    } catch (e) {
      console.warn('Post answer failed:', e.message);
      alert('Failed to post answer.');
    } finally {
      setLoading(false);
    }
  };

  const openQuestion = async (q) => {
    setSelected({ ...q, answers: [] });
    await loadAnswers(q.id);
  };

  return (
    <div className="qna-page" style={{ position: 'relative', minHeight: '100vh' }}>
      <div aria-hidden style={{ position:'absolute', inset:0, zIndex:0, background:
        'radial-gradient(1200px 600px at -10% -10%, rgba(124,58,237,0.24), transparent),\
         radial-gradient(1000px 600px at 110% 0%, rgba(244,114,182,0.22), transparent),\
         radial-gradient(900px 700px at 50% 120%, rgba(124,58,237,0.16), transparent),\
         #0b1220' }} />
    <div className="container" style={{ paddingTop: 32, paddingBottom: 24, position:'relative', zIndex:1 }}>
      {/* Page header */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 16, background: HEADER_BG, border: '1px solid rgba(124,58,237,0.35)', position:'relative', zIndex:2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize: 20, filter:'drop-shadow(0 0 6px rgba(124,58,237,0.6))' }}>💬</span>
              <h2 style={{ margin: 0, textShadow:'0 1px 10px rgba(34,211,238,0.25)' }}>Community Q&A</h2>
            </div>
            <div style={{ opacity: 0.8, marginTop: 4 }}>Ask doubts and help others with clear, step-by-step answers.</div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search questions, topics, subjects..."
              style={{ minWidth: 260, padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(2,6,23,0.35)', color: '#ffffff', caretColor:'#f472b6', boxShadow:'inset 0 0 0 1px rgba(124,58,237,0.25)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Ask a question */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: '0 0 380px', padding: 16, background: CARD_BG, border: '1px solid rgba(124,58,237,0.24)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ marginBottom: 12, marginTop: 0 }}>Ask a Question</h3>
            <span style={{ opacity: 0.8, fontSize: 12 }}>{canPost ? 'Signed in' : 'Sign in to post'}</span>
          </div>
          {!isSupabaseConfigured && (
            <div className="alert" style={{ marginBottom: 8 }}>
              Backend not configured. Posts will not be saved.
            </div>
          )}
          <form onSubmit={submitQuestion}>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label>Title</label>
              <input value={qForm.title} onChange={(e)=>setQForm(f=>({...f,title:e.target.value}))} placeholder="e.g., How to solve quadratic equations?" style={{ width:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.18)', background:'rgba(2,6,23,0.35)', padding:'10px 12px', color:'#ffffff', caretColor:'#f472b6' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label>Subject (optional)</label>
              <input value={qForm.subject} onChange={(e)=>setQForm(f=>({...f,subject:e.target.value}))} placeholder="Mathematics, Science, ..." style={{ width:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.18)', background:'rgba(2,6,23,0.35)', padding:'10px 12px', color:'#ffffff', caretColor:'#f472b6' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Details</label>
              <textarea rows={5} value={qForm.body} onChange={(e)=>setQForm(f=>({...f,body:e.target.value}))} placeholder="Provide context, what you tried, where you're stuck..." style={{ width:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.18)', background:'rgba(2,6,23,0.35)', padding:'10px 12px', color:'#ffffff', caretColor:'#f472b6' }} />
            </div>
            <button className="btn" disabled={loading || !canPost} style={{ boxShadow:`0 0 0 2px rgba(124,58,237,0.35) inset`, background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`, border:'none', color:'#fff' }}>
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </form>
        </motion.div>

        {/* Right: Questions feed */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, padding: 16, background: CARD_BG, border: '1px solid rgba(124,58,237,0.24)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Community Questions</h3>
            <div style={{ opacity: 0.8, fontSize: 12 }}>{filtered.length} results</div>
          </div>
          {loadingList ? (
            <div style={{ display:'grid', gap:12 }}>
              {[...Array(4)].map((_,i)=> (
                <div key={i} style={{ height: 74, borderRadius: 12, background:'linear-gradient(90deg, rgba(124,58,237,0.18), rgba(244,114,182,0.20), rgba(124,58,237,0.18))', backgroundSize:'200% 100%', animation:'shimmer 1.2s infinite' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card" style={{ padding: 16, opacity: 0.95, background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(244,114,182,0.22))', border:'1px solid rgba(244,114,182,0.35)', color:'#fff' }}>No questions yet. Be the first to ask!</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filtered.map(q => (
                <motion.div
                  key={q.id}
                  className="q-item"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  onClick={()=>openQuestion(q)}
                  style={{ cursor: 'pointer', padding: 14, borderRadius: 14, border: '1px solid rgba(124,58,237,0.25)', background:'rgba(2,6,23,0.35)', boxShadow:'0 8px 20px rgba(124,58,237,0.20)', color:'#fff' }}
                >
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                    <div style={{ fontWeight: 800, marginBottom: 2, color:'#e9d5ff' }}>{q.title}</div>
                    <div style={{ display:'flex', gap:8, fontSize:12, opacity:0.85 }}>
                      {q.subject && <span style={{ padding:'2px 8px', borderRadius: 999, background:'rgba(244,114,182,0.25)', border:'1px solid rgba(244,114,182,0.45)', color:'#fff' }}>#{q.subject}</span>}
                      <span>{(q.answers_count||0)} answers</span>
                      <span>{new Date(q.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ opacity: 0.95, marginTop: 4, whiteSpace: 'pre-wrap' }}>{q.body.slice(0,180)}{q.body.length>180?'...':''}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Drawer / Detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginTop: 24, padding: 16, background: CARD_BG, border:'1px solid rgba(124,58,237,0.24)', color:'#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h3 style={{ margin: 0 }}>{selected.title}</h3>
              {selected.subject && <span style={{ padding:'2px 8px', borderRadius: 999, background:'rgba(124,58,237,0.20)', border:'1px solid rgba(124,58,237,0.35)', fontSize:12 }}>#{selected.subject}</span>}
            </div>
            <button className="btn" onClick={()=>setSelected(null)} style={{ boxShadow:`0 0 0 2px rgba(124,58,237,0.35) inset`, color:'#fff' }}>Close</button>
          </div>
          <div style={{ opacity: 0.95, marginTop: 8, whiteSpace: 'pre-wrap' }}>{selected.body}</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, opacity: 0.8, fontSize: 12 }}>
            <span>{new Date(selected.created_at).toLocaleString()}</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ marginTop: 0 }}>Answers</h4>
            {selected.answers && selected.answers.length > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {selected.answers.map(a => (
                  <div key={a.id} style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(244,114,182,0.35)', background:'rgba(2,6,23,0.45)', color:'#fff' }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{a.body}</div>
                    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ opacity: 0.9, background:'rgba(2,6,23,0.25)', padding:12, borderRadius:12, border:'1px solid rgba(34,211,238,0.25)' }}>No answers yet.</div>
            )}
          </div>

          <form onSubmit={submitAnswer} style={{ marginTop: 16 }}>
            <label>Your Answer</label>
            <textarea rows={4} value={aForm.body} onChange={(e)=>setAForm({ body: e.target.value })} placeholder="Write a helpful, step-by-step explanation..." style={{ width:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.18)', background:'rgba(2,6,23,0.35)', padding:'10px 12px', color:'#ffffff', caretColor:'#f472b6' }} />
            <div style={{ marginTop: 8 }}>
              <button className="btn" disabled={loading || !canPost} style={{ boxShadow:`0 0 0 2px rgba(244,114,182,0.40) inset`, background:`linear-gradient(135deg, ${ACCENT_2}, ${ACCENT})`, border:'none', color:'#fff' }}>{loading ? 'Posting...' : 'Post Answer'}</button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
    </div>
  );
}
