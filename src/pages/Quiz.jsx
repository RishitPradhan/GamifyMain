import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import quizzes from "../data/quizzes.json";
import { loadLocalProgress, saveLocalProgress, enqueueSync } from "../stores/localProgress";
import { useProgress } from "../contexts/ProgressContext";

export default function Quiz() {
  const { id } = useParams();
  const quiz = quizzes[id] || [];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const { studentProgress, updateProgress } = useProgress();

  // Map quiz id to our subject keys used for XP calc
  const resolveSubjectKey = () => {
    if (id === 'math' || id === 'mathematics') return 'mathematics';
    if (id === 'science') return 'science';
    if (id === 'technology' || id === 'tech') return 'technology';
    // fallback: try to infer from existing keys
    if (quizzes['math'] && id in quizzes) return 'mathematics';
    if (quizzes['science'] && id in quizzes) return 'science';
    return 'technology';
  };

  const awardQuizProgress = () => {
    const subjectKey = resolveSubjectKey();
    const curr = studentProgress?.[subjectKey]?.quizzes || 0;
    const next = Math.min(100, curr + 1);
    updateProgress(subjectKey, { quizzes: next });
  };

  const profile = JSON.parse(localStorage.getItem("gamify_profile") || "{}");

  const handleAnswer = (opt) => {
    const correct = opt === quiz[index].a;
    if (correct) setScore((s) => s + 1);

    if (index + 1 < quiz.length) setIndex((i) => i + 1);
    else finishQuiz(score + (correct ? 1 : 0));
  };

  const finishQuiz = (finalScore) => {
    alert(`Quiz finished — score: ${finalScore}/${quiz.length}`);

    // Save local progress
    const pid = profile.id || "local_demo";
    const local = loadLocalProgress();
    const existing = local[pid] || { name: profile.name || "Demo", results: [] };

    existing.results.push({
      topic: id,
      score: finalScore,
      total: quiz.length,
      timestamp: new Date().toISOString(),
    });

    local[pid] = existing;
    saveLocalProgress(pid, existing);

    // Enqueue for remote sync
    enqueueSync({
      student_id: pid,
      topic: id,
      score: finalScore,
      timestamp: new Date().toISOString(),
    });

    // Award XP progress for quizzes (triggers DB upsert via ProgressContext)
    awardQuizProgress();
  };

  if (quiz.length === 0) return <p>No quiz for {id}</p>;

  return (
    <div>
      <h2>Quiz: {id}</h2>

      <div className="card">
        {index < quiz.length ? (
          <div>
            <p>
              <strong>{quiz[index].q}</strong>
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {quiz[index].options.map((o, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{ background: "#4b5563" }}
                  onClick={() => handleAnswer(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p>Completed</p>
            <Link className="btn" to="/rewards">
              Claim Reward
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
