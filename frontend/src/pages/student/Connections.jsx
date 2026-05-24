import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { connectionApi } from '../../api'
import { Check, X, UserMinus, Users, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

function ConnectionCard({ conn, onAccept, onReject, onCancel, onDisconnect }) {
  const isIncoming = conn.status === 'pending' && conn.is_received
  const isOutgoing  = conn.status === 'pending' && !conn.is_received
  const isAccepted  = conn.status === 'accepted'
  const other = conn.other_user

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
        {other?.avatar
          ? <img src={`/storage/${other.avatar}`} className="w-full h-full object-cover" alt="" />
          : other?.name?.charAt(0)?.toUpperCase()
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{other?.name}</p>
        <p className="text-xs text-slate-400 truncate">
          {other?.alumni?.job_role ?? other?.student?.branch ?? 'Member'}
          {other?.alumni?.company ? ` @ ${other.alumni.company}` : ''}
        </p>
      </div>

      <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
        {isIncoming && (
          <>
            <button onClick={onAccept} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-medium transition-colors border border-emerald-500/30">
              <Check size={13} /> Accept
            </button>
            <button onClick={onReject} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-colors border border-red-500/30">
              <X size={13} /> Reject
            </button>
          </>
        )}

        {isOutgoing && (
          <>
            <span className="text-xs text-amber-400 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Pending
            </span>
            <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 text-xs transition-colors border border-slate-600">
              <X size={13} /> Cancel
            </button>
          </>
        )}

        {isAccepted && (
          <>
            <span className="text-xs text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Connected
            </span>
            <button onClick={onDisconnect} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 text-xs transition-colors border border-slate-600">
              <UserMinus size={13} /> Remove
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Connections() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionApi.list().then(r => r.data)
  })

  const acceptMut = useMutation({
    mutationFn: (id) => connectionApi.accept(id),
    onSuccess: () => { qc.invalidateQueries(['connections']); toast.success('Connection accepted!') },
    onError:   () => toast.error('Action failed'),
  })

  const rejectMut = useMutation({
    mutationFn: (id) => connectionApi.reject(id),
    onSuccess: () => { qc.invalidateQueries(['connections']); toast.success('Request rejected') },
    onError:   () => toast.error('Action failed'),
  })

  const cancelMut = useMutation({
    mutationFn: (id) => connectionApi.cancel(id),
    onSuccess: () => { qc.invalidateQueries(['connections']); toast.success('Request cancelled') },
    onError:   () => toast.error('Failed to cancel request'),
  })

  const disconnectMut = useMutation({
    mutationFn: (id) => connectionApi.disconnect(id),
    onSuccess: () => { qc.invalidateQueries(['connections']); toast.success('Removed from connections') },
    onError:   () => toast.error('Failed to disconnect'),
  })

  const connections = data?.data ?? []

  const filterFn = c => c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  const incoming = connections.filter(c => c.status === 'pending' && c.is_received  && filterFn(c))
  const outgoing  = connections.filter(c => c.status === 'pending' && !c.is_received && filterFn(c))
  const accepted  = connections.filter(c => c.status === 'accepted' && filterFn(c))

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Connections</h1>
        {/* Search — fixed: icon doesn't overlap placeholder */}
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

      {/* Incoming */}
      {incoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Incoming Requests ({incoming.length})
          </h2>
          <div className="space-y-3">
            {incoming.map(c => (
              <ConnectionCard
                key={c.id} conn={{ ...c, is_received: true }}
                onAccept={() => acceptMut.mutate(c.id)}
                onReject={() => rejectMut.mutate(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outgoing / Sent */}
      {outgoing.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Sent Requests ({outgoing.length})
          </h2>
          <div className="space-y-3">
            {outgoing.map(c => (
              <ConnectionCard
                key={c.id} conn={{ ...c, is_received: false }}
                onCancel={() => cancelMut.mutate(c.id)}
              />
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
              <ConnectionCard
                key={c.id} conn={{ ...c, is_received: false }}
                onDisconnect={() => disconnectMut.mutate(c.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p>No connections yet</p>
            <p className="text-xs mt-1">Discover and connect with alumni to grow your network</p>
          </div>
        )}
      </div>
    </div>
  )
}
