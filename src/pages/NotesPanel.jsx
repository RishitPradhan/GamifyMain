import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Sync with /lesson/math
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

// Sync with /lesson/science
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

const notesData = {
  mathematics: {
    icon: '📐',
    color: '#22d3ee',
    chapters: mathTitles.map((title, i) => ({ id: `m${i+1}`, title, file: `/pdfs/chapter${i+1}.pdf` })),
  },
  science: {
    icon: '🔬',
    color: '#86efac',
    chapters: scienceTitles.map((title, i) => ({ id: `s${i+1}`, title, file: `/pdfs/chapter${i+1}.pdf` })),
  },
};

export default function NotesPanel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState({ mathematics: true, science: true });

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
    <div className="home-dashboard">
      <div className="notes-panel home-align" style={{ padding: '20px 16px', background: 'transparent' }}>
        <h2 className="section-title" style={{ margin: '6px 0 12px' }}>📒 Study Notes</h2>
        <p className="subject-description" style={{ marginTop: 0, marginBottom: 18 }}>
          Access chapter-wise notes for Mathematics and Science
        </p>

        <div className="notes-sections-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20
        }}>
          <Section keyName="mathematics" subject={notesData.mathematics} />
          <Section keyName="science" subject={notesData.science} />
        </div>
      </div>
    </div>
  );
}