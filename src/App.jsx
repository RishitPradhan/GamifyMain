import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MathLesson from './pages/MathLesson'
import Lesson from './pages/Lesson'

import Chapter8Lesson from './pages/Chapter8Lesson' 
import MathSquares from './pages/MathSquares'
import Game from './pages/Game'
import Quiz from './pages/Quiz'
import Rewards from './pages/Rewards'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Profile from './pages/Profile'
import NotesPanel from './pages/NotesPanel'
import Navbar from './components/Navbar'
import BackButton from './components/BackButton'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SubjectDetail from './pages/SubjectDetail'
import GeminiChatbot from './components/GeminiChatBox'



export default function App(){
const location = useLocation();
const isMathLesson = location.pathname === '/lesson/math';
const isProfile = location.pathname === '/profile';
const isDashboard = location.pathname === '/dashboard';
const isLanding = location.pathname === '/';
const isSquares = location.pathname === '/math/squares';
return (
<div>
{/* Show Navbar on all pages except Landing and the Squares page */}
{!isLanding && !isSquares && <Navbar />}
{isSquares && (
  <header style={{
    position:'sticky', top:0, zIndex:10000, width:'100%',
    background:'linear-gradient(180deg, rgba(2,6,23,0.18), rgba(2,6,23,0.10))',
    borderBottom:'1px solid rgba(255,255,255,0.12)',
    padding:'10px 16px', display:'flex', alignItems:'center', gap:8
  }}>
    <BackButton />
  </header>
)}
<div className={(isMathLesson || isProfile || isDashboard) ? 'container full-width' : 'container'}>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/home" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />

{/* Explicit subject routes */}
<Route path="/lesson/math" element={<MathLesson />} />
{/* Alias for direct /math path */}
<Route path="/math" element={<MathLesson />} />
<Route path="/lesson/science" element={<Lesson />} />

<Route path="/lesson/:id" element={<Lesson />} />

<Route path="/chapter8" element={<Chapter8Lesson />} /> 
<Route path="/math/squares" element={<MathSquares />} />
<Route path="/game/:id" element={<Game />} />
<Route path="/quiz/:id" element={<Quiz />} />
<Route path="/rewards" element={<Rewards />} />
<Route path="/achievements" element={<Achievements />} />
<Route path="/leaderboard" element={<Leaderboard />} />
<Route path="/dashboard" element={<TeacherDashboard />} />
<Route path="/profile" element={<Profile />} />
<Route path="/notes" element={<NotesPanel />} />
<Route path="/subject/:subjectKey" element={<SubjectDetail />} />
</Routes>
</div>
{/* Global doubt assistant */}
<GeminiChatbot />

</div>
)
}