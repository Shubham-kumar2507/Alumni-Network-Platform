import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { connectionApi, mentorApi, referralApi, eventApi } from '../../api'
import { Users, Star, Briefcase, CalendarDays, ArrowUpRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform group cursor-pointer">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <ArrowUpRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
    </Link>
  )
}

function ActivityItem({ icon: Icon, title, subtitle, time, color }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-slate-400 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-slate-500 flex-shrink-0">{time}</span>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()

  const { data: connections } = useQuery({ queryKey: ['connections'], queryFn: () => connectionApi.list().then(r => r.data) })
  const { data: mentors } = useQuery({ queryKey: ['mentors'], queryFn: () => mentorApi.list().then(r => r.data) })
  const { data: referrals } = useQuery({ queryKey: ['referrals'], queryFn: () => referralApi.list().then(r => r.data) })
  const { data: events } = useQuery({ queryKey: ['events'], queryFn: () => eventApi.list().then(r => r.data) })

  const acceptedConnections = connections?.data?.filter(c => c.status === 'accepted')?.length ?? 0
  const pendingMentors = mentors?.data?.filter(m => m.status === 'pending')?.length ?? 0
  const pendingReferrals = referrals?.data?.filter(r => r.status === 'pending')?.length ?? 0
  const upcomingEvents = events?.data?.length ?? 0

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="card p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-slate-400 text-sm mt-0.5">Here's what's happening in your network today.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Connections" value={acceptedConnections} color="bg-indigo-500" to="/student/connections" />
        <StatCard icon={Star} label="Mentor Requests" value={pendingMentors} color="bg-amber-500" to="/student/mentorship" />
        <StatCard icon={Briefcase} label="Referrals" value={pendingReferrals} color="bg-emerald-500" to="/student/referrals" />
        <StatCard icon={CalendarDays} label="Events" value={upcomingEvents} color="bg-purple-500" to="/student/events" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/student/alumni', label: 'Discover Alumni', desc: 'Browse and connect with alumni', color: 'from-indigo-500 to-purple-500' },
              { to: '/student/mentorship', label: 'Request Mentorship', desc: 'Get guided by industry experts', color: 'from-amber-500 to-orange-500' },
              { to: '/student/referrals', label: 'Ask for Referral', desc: 'Get referred to top companies', color: 'from-emerald-500 to-teal-500' },
              { to: '/student/messages', label: 'Start a Conversation', desc: 'Message your connections', color: 'from-purple-500 to-pink-500' },
            ].map(({ to, label, desc, color }) => (
              <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Upcoming Events</h2>
            <Link to="/student/events" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>
          {events?.data?.length ? (
            <div className="space-y-3">
              {events.data.slice(0, 3).map(evt => (
                <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-400">{new Date(evt.event_date).getDate()}</span>
                    <span className="text-[10px] text-indigo-300">{new Date(evt.event_date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{evt.title}</p>
                    <p className="text-xs text-slate-400">{evt.type} • {evt.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
