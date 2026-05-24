import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { connectionApi, mentorApi, referralApi, eventApi } from '../../api'
import { Users, Star, Briefcase, CalendarDays, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AlumniDashboard() {
  const { user } = useAuth()
  const { data: connections } = useQuery({ queryKey: ['alumni-connections'], queryFn: () => connectionApi.list().then(r => r.data) })
  const { data: mentors } = useQuery({ queryKey: ['alumni-mentors'], queryFn: () => mentorApi.listMentees().then(r => r.data) })
  const { data: referrals } = useQuery({ queryKey: ['alumni-referrals'], queryFn: () => referralApi.list().then(r => r.data) })
  const { data: events } = useQuery({ queryKey: ['alumni-events'], queryFn: () => eventApi.list().then(r => r.data) })

  const stats = [
    { icon: Users, label: 'Connections', value: connections?.data?.filter(c => c.status === 'accepted')?.length ?? 0, color: 'bg-indigo-500', to: '/alumni/connections' },
    { icon: Star, label: 'Mentee Requests', value: mentors?.data?.filter(m => m.status === 'pending')?.length ?? 0, color: 'bg-amber-500', to: '/alumni/mentorship' },
    { icon: Briefcase, label: 'Referral Requests', value: referrals?.data?.filter(r => r.status === 'pending')?.length ?? 0, color: 'bg-emerald-500', to: '/alumni/referrals' },
    { icon: CalendarDays, label: 'My Events', value: events?.data?.length ?? 0, color: 'bg-purple-500', to: '/alumni/events' },
  ]

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hello, {user?.name?.split(' ')[0]}! 🎓</h1>
            <p className="text-slate-400 text-sm mt-0.5">You're making a difference. Keep inspiring!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, to }) => (
          <Link key={to} to={to} className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
            <ArrowUpRight size={18} className="ml-auto text-slate-600 group-hover:text-slate-400" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-base font-semibold text-white mb-4">Impact Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Students mentored', value: mentors?.data?.filter(m => m.status === 'accepted')?.length ?? 0, icon: Star, color: 'text-amber-400' },
              { label: 'Referrals given', value: referrals?.data?.filter(r => r.status === 'accepted')?.length ?? 0, icon: Briefcase, color: 'text-emerald-400' },
              { label: 'Active connections', value: connections?.data?.filter(c => c.status === 'accepted')?.length ?? 0, icon: Users, color: 'text-indigo-400' },
              { label: 'Events organized', value: events?.data?.length ?? 0, icon: CalendarDays, color: 'text-purple-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                <Icon size={18} className={color} />
                <span className="text-sm text-slate-300 flex-1">{label}</span>
                <span className="text-sm font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Pending Actions</h2>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            {[
              { to: '/alumni/mentorship', label: 'Review mentor requests', count: mentors?.data?.filter(m => m.status === 'pending')?.length, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
              { to: '/alumni/referrals', label: 'Review referral requests', count: referrals?.data?.filter(r => r.status === 'pending')?.length, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              { to: '/alumni/connections', label: 'Pending connections', count: connections?.data?.filter(c => c.status === 'pending')?.length, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
            ].map(({ to, label, count, color }) => (
              <Link key={to} to={to} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors group">
                <span className="text-sm text-slate-300 group-hover:text-white">{label}</span>
                {count > 0 && <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>{count}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
