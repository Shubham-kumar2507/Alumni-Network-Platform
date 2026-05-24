import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { connectionApi } from '../../api'
import { Check, X, UserMinus, Users, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AlumniConnections() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-connections'],
    queryFn: () => connectionApi.list().then(r => r.data)
  })

  const acceptMut = useMutation({
    mutationFn: (id) => connectionApi.accept(id),
    onSuccess: () => { qc.invalidateQueries(['alumni-connections']); toast.success('Connection accepted!') },
    onError:   () => toast.error('Action failed'),
  })

  const rejectMut = useMutation({
    mutationFn: (id) => connectionApi.reject(id),
    onSuccess: () => { qc.invalidateQueries(['alumni-connections']); toast.success('Request rejected') },
    onError:   () => toast.error('Action failed'),
  })

  const disconnectMut = useMutation({
    mutationFn: (id) => connectionApi.disconnect(id),
    onSuccess: () => { qc.invalidateQueries(['alumni-connections']); toast.success('Removed from connections') },
    onError:   () => toast.error('Failed to disconnect'),
  })

  const connections = data?.data ?? []
  const filterFn  = c => c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  const incoming   = connections.filter(c => c.status === 'pending' && c.is_received && filterFn(c))
  const accepted   = connections.filter(c => c.status === 'accepted' && filterFn(c))

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Connections</h1>
        {/* Fixed search icon overlap */}
        <div className="search-wrapper w-64">
          <Search size={15} className="search-icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field search-input"
            placeholder="Search connections..."
          />
        </div>
      </div>

      {/* Pending Incoming Requests */}
      {incoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Pending Requests ({incoming.length})
          </h2>
          <div className="space-y-3">
            {incoming.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {c.other_user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{c.other_user?.name}</p>
                  <p className="text-xs text-slate-400">
                    {c.other_user?.student?.branch}
                    {c.other_user?.student?.college ? ` • ${c.other_user.student.college}` : ''}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => acceptMut.mutate(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs border border-emerald-500/30 transition-colors">
                    <Check size={13} /> Accept
                  </button>
                  <button onClick={() => rejectMut.mutate(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs border border-red-500/30 transition-colors">
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted / Network */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
          My Network ({accepted.length})
        </h2>
        {accepted.length ? (
          <div className="space-y-3">
            {accepted.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {c.other_user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{c.other_user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {c.other_user?.student?.branch}
                    {c.other_user?.student?.college ? ` • ${c.other_user.student.college}` : ''}
                    {c.other_user?.alumni?.job_role ? ` ${c.other_user.alumni.job_role}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => disconnectMut.mutate(c.id)}
                  disabled={disconnectMut.isPending}
                  title="Remove connection"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 text-xs transition-colors border border-slate-600 flex-shrink-0"
                >
                  <UserMinus size={13} /> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p>No connections yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
