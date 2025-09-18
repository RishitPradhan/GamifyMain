import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sync with NotesPanel subject lists
const mathTitles = [
  'Linear Equations in One Variable',
  'Rational Numbers',
  'Understanding Quadrilaterals',
  'Cubes and Cube Roots',
  'Data Handling',
  'Squares and Square Roots',
  'Comparing Quantities',
  'Algebraic Expressions and Identities',
  'Mensuration',
  'Exponents and Powers',
  'Direct and Inverse Proportions',
  'Factorisation',
  'Introduction to Graphs',
];

const scienceTitles = [
  'Crop Production and Management',
  'Plant Life',
  'Animal Kingdom',
  'Water Cycle',
  'Human Body',
  'Electricity',
  'Chemistry',
  'Forces & Motion',
  'Light & Sound',
  'Earth Science',
  'Space Exploration',
  'Environmental Science',
];

const pyqData = {
  mathematics: {
    icon: '📝',
    color: '#f472b6', // pink accent
    chapters: mathTitles.map((title, i) => ({ id: `pm${i+1}`, title, file: `/pdfs/pyq_math_${i+1}.pdf` })),
  },
  science: {
    icon: '📝',
    color: '#7c3aed', // violet accent
    chapters: scienceTitles.map((title, i) => ({ id: `ps${i+1}`, title, file: `/pdfs/pyq_science_${i+1}.pdf` })),
  },
};

export default function PYQ() {
  const [open] = useState({ mathematics: true, science: true });

  const Section = ({ keyName, subject }) => (
    <motion.section
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{ padding: 16, marginBottom: 20 }}
    >
      <div
        className="subject-toggle"
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent', color: 'inherit', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px'
        }}
      >
        <span className="subject-left" style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
          <span className="subject-icon" aria-hidden>{subject.icon}</span>
          <span className="subject-name" style={{ fontWeight: 700 }}>
            {keyName === 'mathematics' ? 'Mathematics' : 'Science'}
          </span>
        </span>
      </div>

      <AnimatePresence initial={false}>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 14, listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}
        >
          {subject.chapters.map((ch, idx) => (
            <li key={ch.id} className="glass-card" style={{
              display: 'grid', gridTemplateColumns: '52px 1fr auto', alignItems: 'center',
              gap: 12, padding: '10px 12px'
            }}>
              <div className="xp-pill" style={{
                position: 'static',
                background: subject.color,
                color: '#0b0b0b',
                fontWeight: 800,
                border: '3px solid #3b1747',
                boxShadow: '0 0 0 3px #3b1747 inset',
                padding: '6px 10px',
                borderRadius: 6,
                textAlign: 'center'
              }}>{idx + 1}</div>
              <div className="chapter-title" style={{ margin: 0, fontSize: '1.12rem', color: '#fff', fontWeight: 600 }}>{ch.title}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a className="btn" href={ch.file} target="_blank" rel="noreferrer">View</a>
                <a className="btn" href={ch.file} download>Download</a>
              </div>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </motion.section>
  );

  return (
    <div className="home-dashboard" style={{ position:'relative', minHeight:'100vh' }}>
      <div aria-hidden style={{ position:'absolute', inset:0, zIndex:0, background:
        'radial-gradient(1200px 600px at -10% -10%, rgba(124,58,237,0.24), transparent),\
         radial-gradient(1000px 600px at 110% 0%, rgba(244,114,182,0.22), transparent),\
         radial-gradient(900px 700px at 50% 120%, rgba(124,58,237,0.16), transparent),\
         #0b1220' }} />
      <div className="notes-panel home-align" style={{ padding: '20px 16px', background: 'transparent', position:'relative', zIndex:1 }}>
        <h2 className="section-title" style={{ margin: '6px 0 12px' }}>🧪 Previous Year Questions</h2>
        <p className="subject-description" style={{ marginTop: 0, marginBottom: 18 }}>
          Access chapter-wise Previous Year Questions (PYQs) for Mathematics and Science
        </p>

        <div className="notes-sections-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20
        }}>
          <Section keyName="mathematics" subject={pyqData.mathematics} />
          <Section keyName="science" subject={pyqData.science} />
        </div>
      </div>
    </div>
  );
}
