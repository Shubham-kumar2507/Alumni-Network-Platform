import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorApi, messageApi } from '../../api'
import { Check, X, Star, Clock, MessageSquare, UserMinus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import StudentDetailDrawer from '../../components/StudentDetailDrawer'
import { useState } from 'react'

export default function AlumniMentorship() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [viewStudent, setViewStudent] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-mentors'],
    queryFn: () => mentorApi.listMentees().then(r => r.data)
  })

  const actionMut = useMutation({
    mutationFn: ({ id, action }) => action === 'accept' ? mentorApi.accept(id) : mentorApi.reject(id),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries(['alumni-mentors'])
      toast.success(`Request ${action}ed!`)
    },
    onError: () => toast.error('Action failed'),
  })

  // Start a chat and navigate to messages
  const startChatMut = useMutation({
    mutationFn: (userId) => messageApi.startChat(userId),
    onSuccess: () => {
      navigate('/alumni/messages')
      toast.success('Chat opened!')
    },
    onError: () => toast.error('Could not start chat'),
  })

  // End mentorship (alumni removes mentee)
  const removeMentee = useMutation({
    mutationFn: (id) => mentorApi.removeMentee(id),
    onSuccess: () => { qc.invalidateQueries(['alumni-mentors']); toast.success('Mentorship ended') },
    onError:   () => toast.error('Failed to end mentorship'),
  })

  const requests = data?.data ?? []
  const pending  = requests.filter(r => r.status === 'pending')
  const accepted = requests.filter(r => r.status === 'accepted')

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Mentorship Requests</h1>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {r.student?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{r.student?.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.student?.student?.branch}
                      {r.student?.student?.college ? ` • ${r.student.student.college}` : ''}
                    </p>
                    {r.message && (
                      <p className="mt-2 text-sm text-slate-300 bg-slate-800/50 rounded-xl p-3 italic">
                        "{r.message}"
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Clock size={11} /> {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <button
                      onClick={() => actionMut.mutate({ id: r.id, action: 'accept' })}
                      disabled={actionMut.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs border border-emerald-500/30 transition-colors"
                    >
                      <Check size={13} /> Accept
                    </button>
                    <button
                      onClick={() => actionMut.mutate({ id: r.id, action: 'reject' })}
                      disabled={actionMut.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs border border-red-500/30 transition-colors"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Mentees */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
          Active Mentees ({accepted.length})
        </h2>
        {accepted.length ? (
          <div className="space-y-3">
            {accepted.map(r => (
              <div key={r.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {r.student?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{r.student?.name}</p>
                  <p className="text-xs text-slate-400">
                    {r.student?.student?.branch}
                    {r.student?.student?.graduation_year ? ` • Class of ${r.student.student.graduation_year}` : ''}
                  </p>
                  {r.student?.email && (
                    <p className="text-xs text-slate-500 mt-0.5">{r.student.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  <span className="text-xs text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Mentoring
                  </span>
                  {/* View student profile */}
                  <button
                    onClick={() => setViewStudent(r.student)}
                    title="View student profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-slate-700 text-xs transition-colors border border-slate-600"
                  >
                    <Eye size={13} /> View
                  </button>
                  {/* Message mentee button */}
                  <button
                    onClick={() => startChatMut.mutate(r.student?.id)}
                    disabled={startChatMut.isPending}
                    title="Send message"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs border border-indigo-500/30 transition-colors"
                  >
                    <MessageSquare size={13} /> Message
                  </button>
                  {/* End mentorship button */}
                  <button
                    onClick={() => removeMentee.mutate(r.id)}
                    disabled={removeMentee.isPending}
                    title="End mentorship"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 text-xs transition-colors border border-slate-600"
                  >
                    <UserMinus size={13} /> End
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <Star size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No active mentees yet</p>
            <p className="text-xs mt-1 text-slate-600">Accept pending requests above to start mentoring</p>
          </div>
        )}
      </div>

      {pending.length === 0 && accepted.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Star size={40} className="mx-auto mb-3 opacity-40" />
          <p>No mentorship requests yet</p>
          <p className="text-xs mt-1 text-slate-600">Students will send requests to you from your public profile</p>
        </div>
      )}

      {/* Student detail drawer */}
      <StudentDetailDrawer student={viewStudent} onClose={() => setViewStudent(null)} />
    </div>
  )
}
