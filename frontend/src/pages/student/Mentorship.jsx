import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorApi, messageApi } from '../../api'
import { Star, Clock, X, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLES = {
  pending:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function StudentMentorship() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => mentorApi.list().then(r => r.data)
  })

  const withdrawMut = useMutation({
    mutationFn: (id) => mentorApi.withdraw(id),
    onSuccess: () => { qc.invalidateQueries(['mentors']); toast.success('Mentor request withdrawn') },
    onError:   () => toast.error('Failed to withdraw request'),
  })

  const startChatMut = useMutation({
    mutationFn: (userId) => messageApi.startChat(userId),
    onSuccess: () => { navigate('/student/messages'); toast.success('Chat opened!') },
    onError:   () => toast.error('Could not start chat'),
  })

  const requests = data?.data ?? []

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Mentorship Requests</h1>
      </div>

      {requests.length ? (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {r.alumni?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{r.alumni?.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.alumni?.alumni?.job_role}
                      {r.alumni?.alumni?.company ? ` @ ${r.alumni.alumni.company}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${STATUS_STYLES[r.status]}`}>
                    {r.status}
                  </span>
                  {/* Message button for accepted mentors */}
                  {r.status === 'accepted' && (
                    <button
                      onClick={() => startChatMut.mutate(r.alumni?.id)}
                      disabled={startChatMut.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs transition-colors border border-indigo-500/30"
                    >
                      <MessageSquare size={13} /> Message
                    </button>
                  )}
                  {/* Withdraw / Leave button */}
                  {(r.status === 'pending' || r.status === 'accepted') && (
                    <button
                      onClick={() => withdrawMut.mutate(r.id)}
                      disabled={withdrawMut.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 text-xs transition-colors border border-slate-600"
                    >
                      <X size={12} />
                      {r.status === 'pending' ? 'Cancel' : 'Leave'}
                    </button>
                  )}
                </div>
              </div>

              {r.message && (
                <p className="mt-3 text-sm text-slate-400 bg-slate-800/50 rounded-xl p-3 italic">
                  "{r.message}"
                </p>
              )}
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Clock size={11} /> {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Star size={40} className="mx-auto mb-3 opacity-40" />
          <p>No mentor requests yet</p>
          <p className="text-xs mt-1">Visit an alumni profile to request mentorship</p>
        </div>
      )}
    </div>
  )
}
