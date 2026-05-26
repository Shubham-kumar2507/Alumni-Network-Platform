import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Landing
import LandingPage from './pages/LandingPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Layouts
import StudentLayout from './layouts/StudentLayout'
import AlumniLayout from './layouts/AlumniLayout'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'
import AlumniDiscovery from './pages/student/AlumniDiscovery'
import AlumniProfile from './pages/student/AlumniProfile'
import Connections from './pages/student/Connections'
import Mentorship from './pages/student/Mentorship'
import Referrals from './pages/student/Referrals'
import Messages from './pages/shared/Messages'
import Events from './pages/shared/Events'

// Alumni pages
import AlumniDashboard from './pages/alumni/Dashboard'
import AlumniProfileEdit from './pages/alumni/Profile'
import AlumniConnections from './pages/alumni/Connections'
import AlumniMentorship from './pages/alumni/Mentorship'
import AlumniReferrals from './pages/alumni/Referrals'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="loading-spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'alumni' ? '/alumni' : '/student'} replace />
  return children
}

// Auth pages (login/register) redirect logged-in users to their dashboard
function AuthRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="loading-spinner" /></div>
  if (user) return <Navigate to={user.role === 'alumni' ? '/alumni' : '/student'} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — always visible at "/" */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth — redirects to dashboard if already logged in */}
        <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile"     element={<StudentProfile />} />
          <Route path="alumni"      element={<AlumniDiscovery />} />
          <Route path="alumni/:id"  element={<AlumniProfile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="mentorship"  element={<Mentorship />} />
          <Route path="referrals"   element={<Referrals />} />
          <Route path="messages"    element={<Messages />} />
          <Route path="events"      element={<Events />} />
        </Route>

        {/* Alumni */}
        <Route path="/alumni" element={<ProtectedRoute role="alumni"><AlumniLayout /></ProtectedRoute>}>
          <Route index element={<AlumniDashboard />} />
          <Route path="profile"     element={<AlumniProfileEdit />} />
          <Route path="connections" element={<AlumniConnections />} />
          <Route path="mentorship"  element={<AlumniMentorship />} />
          <Route path="referrals"   element={<AlumniReferrals />} />
          <Route path="messages"    element={<Messages />} />
          <Route path="events"      element={<Events />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
