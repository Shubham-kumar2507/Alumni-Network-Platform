import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { CalendarDays, MapPin, Clock, ExternalLink, Plus, Trash2, Briefcase } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const EVENT_TYPES = [
  { value: 'webinar',     label: 'Webinar' },
  { value: 'workshop',    label: 'Workshop' },
  { value: 'meetup',      label: 'Meetup' },
  { value: 'networking',  label: 'Networking' },
  { value: 'seminar',     label: 'Seminar' },
  { value: 'job_fair',    label: 'Job Fair' },
  { value: 'internship',  label: 'Internship Drive' },
  { value: 'job',         label: 'Job Posting' },
  { value: 'other',       label: 'Other' },
]

const JOB_CATEGORIES = [
  { value: '',            label: 'No Category' },
  { value: 'internship',  label: 'Internship' },
  { value: 'full_time',   label: 'Full-Time Job' },
  { value: 'part_time',   label: 'Part-Time Job' },
  { value: 'contract',    label: 'Contract' },
  { value: 'volunteer',   label: 'Volunteer' },
]

const TYPE_COLORS = {
  webinar:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  workshop:    'bg-purple-500/20 text-purple-400 border-purple-500/30',
  meetup:      'bg-green-500/20 text-green-400 border-green-500/30',
  networking:  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  seminar:     'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  job_fair:    'bg-amber-500/20 text-amber-400 border-amber-500/30',
  internship:  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  job:         'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  other:       'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const EMPTY_FORM = {
  title: '', description: '', event_date: '', location: '',
  type: 'webinar', category: '', registration_link: ''
}

export default function Events() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.list().then(r => r.data)
  })
  const events = data?.data ?? []

  const createMut = useMutation({
    mutationFn: (payload) => eventApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries(['events'])
      setShowForm(false)
      setForm(EMPTY_FORM)
      toast.success('Event created!')
    },
    onError: (err) => {
      const msg = err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        'Failed to create event'
      toast.error(msg)
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id) => eventApi.delete(id),
    onSuccess: () => { qc.invalidateQueries(['events']); toast.success('Event deleted') },
    onError: () => toast.error('Failed to delete event'),
  })

  const isAlumni = user?.role === 'alumni'
  const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }))

  // Show job category only for internship/job/job_fair types
  const showCategory = ['internship', 'job', 'job_fair'].includes(form.type)

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Events & Opportunities</h1>
        {isAlumni && (
          <button onClick={() => setShowForm(v => !v)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> {showForm ? 'Cancel' : '+ Create Event'}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showForm && isAlumni && (
        <div className="card p-5">
          <h2 className="font-semibold text-white mb-4">New Event / Opportunity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="form-label">Title *</label>
              <input value={form.title} onChange={f('title')} className="input-field" placeholder="e.g. React Workshop 2026 / SDE Intern at Google" />
            </div>

            {/* Date & Type */}
            <div>
              <label className="form-label">Date & Time *</label>
              <input type="datetime-local" value={form.event_date} onChange={f('event_date')} className="input-field" />
            </div>
            <div>
              <label className="form-label">Type *</label>
              <select value={form.type} onChange={f('type')} className="input-field">
                {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Job Category (conditional) */}
            {showCategory && (
              <div>
                <label className="form-label">Job Category</label>
                <select value={form.category} onChange={f('category')} className="input-field">
                  {JOB_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="form-label">Location / Platform</label>
              <input value={form.location} onChange={f('location')} className="input-field" placeholder="Zoom / Office / Remote" />
            </div>

            {/* Registration Link */}
            <div>
              <label className="form-label">Registration / Apply Link</label>
              <input value={form.registration_link} onChange={f('registration_link')} className="input-field" placeholder="https://..." />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={f('description')} rows={3} className="input-field resize-none" placeholder="Add details about this event or opportunity..." />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3">
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={() => createMut.mutate(form)}
                disabled={createMut.isPending || !form.title || !form.event_date}
                className="btn-primary flex items-center gap-2"
              >
                {createMut.isPending ? <div className="loading-spinner !w-4 !h-4 !border-2" /> : <Plus size={15} />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {events.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(evt => {
            const typeColor = TYPE_COLORS[evt.type] || TYPE_COLORS.other
            const isMyEvent = isAlumni && evt.alumni_id === user?.id
            return (
              <div key={evt.id} className="card p-5 hover:border-indigo-500/30 transition-all hover:scale-[1.01]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${typeColor}`}>
                      {evt.type?.replace('_', ' ')}
                    </span>
                    {evt.category && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 capitalize flex items-center gap-1">
                        <Briefcase size={10} />
                        {evt.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {isMyEvent && (
                    <button
                      onClick={() => deleteMut.mutate(evt.id)}
                      disabled={deleteMut.isPending}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <h3 className="font-semibold text-white mb-2 line-clamp-2">{evt.title}</h3>
                {evt.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{evt.description}</p>}

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(evt.event_date).toLocaleDateString('en-IN', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  {evt.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} /> {evt.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    By {evt.organizer?.name ?? 'Alumni'}
                  </div>
                </div>

                {evt.registration_link && (
                  <a
                    href={evt.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Register / Apply <ExternalLink size={11} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
          <p>No events yet</p>
          {isAlumni && <p className="text-sm mt-1 text-slate-600">Click "Create Event" to post one</p>}
        </div>
      )}
    </div>
  )
}
