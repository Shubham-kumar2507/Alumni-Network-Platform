import { useQuery } from '@tanstack/react-query'
import { referralApi } from '../../api'
import { Briefcase, Clock } from 'lucide-react'

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function Referrals() {
  const { data, isLoading } = useQuery({ queryKey: ['referrals'], queryFn: () => referralApi.list().then(r => r.data) })
  const referrals = data?.data ?? []

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">My Referral Requests</h1>
      {referrals.length ? (
        <div className="space-y-4">
          {referrals.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {r.alumni?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{r.alumni?.name}</p>
                    <p className="text-xs text-slate-400">{r.alumni?.alumni?.company}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-indigo-400" />
                  <span className="text-sm font-medium text-white">{r.job_title} @ {r.company}</span>
                </div>
                {r.message && <p className="text-xs text-slate-400 italic">"{r.message}"</p>}
                {r.comments && <p className="text-xs text-emerald-400 mt-2 border-t border-slate-700 pt-2">Alumni note: {r.comments}</p>}
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Clock size={11} /> {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
          <p>No referral requests yet</p>
          <p className="text-xs mt-1">Visit an alumni profile to request a referral</p>
        </div>
      )}
    </div>
  )
}
