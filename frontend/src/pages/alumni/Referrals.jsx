import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { referralApi } from '../../api'
import { Check, X, Briefcase, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function AlumniReferrals() {
  const qc = useQueryClient()
  const [comments, setComments] = useState({})

  const { data, isLoading } = useQuery({ queryKey: ['alumni-referrals'], queryFn: () => referralApi.list().then(r => r.data) })

  const actionMut = useMutation({
    mutationFn: ({ id, action, comment }) => action === 'accept' ? referralApi.accept(id, { comments: comment }) : referralApi.reject(id, { comments: comment }),
    onSuccess: (_, { action }) => { qc.invalidateQueries(['alumni-referrals']); toast.success(`Referral ${action}ed!`) },
    onError: () => toast.error('Action failed'),
  })

  const referrals = data?.data ?? []
  const pending = referrals.filter(r => r.status === 'pending')
  const resolved = referrals.filter(r => r.status !== 'pending')

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Referral Requests</h1>

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Pending ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {r.student?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{r.student?.name}</p>
                    <p className="text-xs text-slate-400">{r.student?.student?.branch} • {r.student?.student?.college}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Briefcase size={13} className="text-indigo-400" />
                      <span className="text-sm text-slate-300">{r.job_title} @ {r.company}</span>
                    </div>
                    {r.message && <p className="mt-2 text-xs text-slate-400 italic bg-slate-800/50 p-3 rounded-lg">"{r.message}"</p>}
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <input
                    value={comments[r.id] ?? ''}
                    onChange={e => setComments(p => ({ ...p, [r.id]: e.target.value }))}
                    className="input-field mb-3"
                    placeholder="Add a note (optional)"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => actionMut.mutate({ id: r.id, action: 'accept', comment: comments[r.id] ?? '' })} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm border border-emerald-500/30 font-medium transition-colors">
                      <Check size={15} /> Accept Referral
                    </button>
                    <button onClick={() => actionMut.mutate({ id: r.id, action: 'reject', comment: comments[r.id] ?? '' })} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm border border-red-500/30 font-medium transition-colors">
                      <X size={15} /> Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Resolved ({resolved.length})</h2>
          <div className="space-y-3">
            {resolved.map(r => (
              <div key={r.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {r.student?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{r.student?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{r.job_title} @ {r.company}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!pending.length && !resolved.length && (
        <div className="text-center py-16 text-slate-500">
          <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
          <p>No referral requests yet</p>
        </div>
      )}
    </div>
  )
}
