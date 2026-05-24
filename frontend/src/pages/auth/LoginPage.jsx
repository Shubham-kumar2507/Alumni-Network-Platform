import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'alumni' ? '/alumni' : '/student')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 80%, #a855f7 0%, transparent 50%)'}} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/30">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AlumniNet</h1>
          <p className="text-indigo-200 text-lg max-w-xs mx-auto leading-relaxed">
            Connect, grow, and thrive with your alumni network
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[['500+', 'Alumni'], ['200+', 'Students'], ['50+', 'Mentors']].map(([n, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold text-white">{n}</p>
                <p className="text-xs text-indigo-200">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white">AlumniNet</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pr-11"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <div className="loading-spinner !w-5 !h-5 !border-2" /> : <>Sign in <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
