import { supabase } from '../supabaseClient';

export async function getQuizByChapter(chapterId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, time_limit_sec, difficulty')
    .eq('chapter_id', chapterId)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

export async function getQuestions(quizId) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, prompt, choices, correct_index, order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function submitAttempt({ userId, quizId, score, answers }) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({ user_id: userId, quiz_id: quizId, score, answers });
  if (error) throw new Error(error.message);
}

export async function createQuiz({ subjectId, chapterId, title, difficulty = 'easy', timeLimitSec = 0, createdBy }) {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({ subject_id: subjectId, chapter_id: chapterId, title, difficulty, time_limit_sec: timeLimitSec, created_by: createdBy })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function addQuestion({ quizId, prompt, choices, correctIndex, orderIndex = 0 }) {
  const { error } = await supabase
    .from('quiz_questions')
    .insert({ quiz_id: quizId, prompt, choices, correct_index: correctIndex, order_index: orderIndex });
  if (error) throw new Error(error.message);
}
