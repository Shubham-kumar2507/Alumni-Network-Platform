import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  LayoutDashboard, User, GitBranch, Star, Briefcase,
  MessageSquare, CalendarDays, Sun, Moon, LogOut, GraduationCap, Menu, Plus
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/alumni', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/alumni/profile', icon: User, label: 'My Profile' },
  { to: '/alumni/connections', icon: GitBranch, label: 'Connections' },
  { to: '/alumni/mentorship', icon: Star, label: 'Mentorship' },
  { to: '/alumni/referrals', icon: Briefcase, label: 'Referrals' },
  { to: '/alumni/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/alumni/events', icon: CalendarDays, label: 'Events' },
]

export default function AlumniLayout() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">AlumniNet</p>
            <p className="text-xs text-emerald-400">Alumni Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-link-base ${isActive ? 'active-alumni' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
              {dark ? 'Light' : 'Dark'}
            </button>
            <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center px-4 gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-slate-200">Alumni Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
