import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, Eye, EyeOff, ArrowRight, User, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'student' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created successfully!')
      navigate(user.role === 'alumni' ? '/alumni' : '/student')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">AlumniNet</span>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-slate-400 mb-6 text-sm">Join the alumni network today</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'student', icon: User, label: 'Student', desc: 'Looking for opportunities' },
              { value: 'alumni', icon: Briefcase, label: 'Alumni', desc: 'Help the community' },
            ].map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(p => ({ ...p, role: value }))}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  form.role === value
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Icon size={22} className={form.role === value ? 'text-indigo-400' : 'text-slate-500'} />
                <p className="font-semibold mt-2 text-sm">{label}</p>
                <p className="text-xs mt-0.5 opacity-70">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field pr-11" placeholder="Min. 8 characters" minLength={8} />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Confirm Password</label>
              <input type="password" required value={form.password_confirmation} onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))} className="input-field" placeholder="Repeat your password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <div className="loading-spinner !w-5 !h-5 !border-2" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
