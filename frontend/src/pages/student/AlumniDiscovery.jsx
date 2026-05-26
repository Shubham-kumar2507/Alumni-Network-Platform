import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { alumniApi, connectionApi, mentorApi, referralApi } from '../../api'
import {
  Search, Filter, MapPin, Briefcase, GraduationCap, X,
  GitBranch, Star, ChevronRight, Link2, GitFork, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Consulting', 'E-commerce', 'Other']

/* ── Referral Request Modal ── */
function ReferralModal({ alumni, onClose, onSubmit, isPending }) {
  const [jobTitle, setJobTitle] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!jobTitle.trim()) {
      toast.error('Please enter the job title')
      return
    }
    onSubmit({ job_title: jobTitle.trim(), message: message.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Request Referral</h3>
            <p className="text-sm text-slate-400 mt-0.5">
              from <span className="text-emerald-400">{alumni?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Job Title <span className="text-red-400">*</span>
            </label>
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="input-field w-full"
              placeholder="e.g. Software Engineer, Product Manager"
              required
              autoFocus
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Message <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Why are you interested in this role? Any context you'd like to share..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !jobTitle.trim()}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Inline action buttons on each card ── */
function AlumniCard({ a, onViewProfile }) {
  const [showReferralModal, setShowReferralModal] = useState(false)

  const connectMut = useMutation({
    mutationFn: () => connectionApi.send({ receiver_id: a.id }),
    onSuccess: () => toast.success('Connection request sent!'),
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })
  const mentorMut = useMutation({
    mutationFn: () => mentorApi.request({ alumni_id: a.id, message: '' }),
    onSuccess: () => toast.success('Mentor request sent!'),
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })
  const referralMut = useMutation({
    mutationFn: ({ job_title, message }) =>
      referralApi.request({ alumni_id: a.id, job_title, message }),
    onSuccess: () => {
      toast.success('Referral request sent!')
      setShowReferralModal(false)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })

  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-indigo-500/30 transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {a.avatar ? <img src={`/storage/${a.avatar}`} className="w-full h-full object-cover" alt="" /> : a.name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{a.name}</p>
          <p className="text-xs text-slate-400 truncate">{a.alumni?.job_role ?? 'Alumni'}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 text-xs text-slate-400">
        {a.alumni?.company && (
          <div className="flex items-center gap-1.5"><Briefcase size={12} /><span className="truncate">{a.alumni.company}</span></div>
        )}
        {a.alumni?.industry && (
          <div className="flex items-center gap-1.5"><MapPin size={12} /><span className="truncate">{a.alumni.industry}</span></div>
        )}
        {a.alumni?.graduation_year && (
          <div className="flex items-center gap-1.5"><GraduationCap size={12} /><span>Class of {a.alumni.graduation_year}</span></div>
        )}
      </div>

      {/* Skills */}
      {a.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {a.skills.slice(0, 3).map(s => (
            <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">{s.name}</span>
          ))}
          {a.skills.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">+{a.skills.length - 3}</span>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
        <button
          onClick={() => connectMut.mutate()}
          disabled={connectMut.isPending}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs border border-indigo-500/30 transition-colors"
        >
          <GitBranch size={12} /> Connect
        </button>
        <button
          onClick={() => mentorMut.mutate()}
          disabled={mentorMut.isPending}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs border border-amber-500/20 transition-colors"
        >
          <Star size={12} /> Mentor
        </button>
        <button
          onClick={() => setShowReferralModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs border border-emerald-500/20 transition-colors"
        >
          <Briefcase size={12} /> Referral
        </button>
        <button
          onClick={() => onViewProfile(a)}
          className="ml-auto flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Profile <ChevronRight size={13} />
        </button>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          alumni={a}
          onClose={() => setShowReferralModal(false)}
          onSubmit={(data) => referralMut.mutate(data)}
          isPending={referralMut.isPending}
        />
      )}
    </div>
  )
}

/* ── Alumni Detail Drawer/Modal ── */
function AlumniDetailModal({ alumni, onClose }) {
  if (!alumni) return null
  const profile = alumni.alumni

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 overflow-y-auto p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
            {alumni.avatar ? <img src={`/storage/${alumni.avatar}`} className="w-full h-full object-cover" alt="" /> : alumni.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white">{alumni.name}</h2>
            <p className="text-sm text-emerald-400">{profile?.job_role}{profile?.company && ` @ ${profile.company}`}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile?.industry}{profile?.experience_years && ` • ${profile.experience_years} yrs exp`}</p>
            <div className="flex gap-3 mt-2">
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" title="LinkedIn">
                  <Link2 size={16} />
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
                  <GitFork size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="p-4 bg-slate-800/60 rounded-xl">
            <p className="text-sm text-slate-300 leading-relaxed italic">"{profile.bio}"</p>
          </div>
        )}

        {/* Details */}
        <div className="card p-4 space-y-3">
          {profile?.graduation_year && (
            <div className="flex items-center gap-3">
              <GraduationCap size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Graduation</p>
                <p className="text-sm text-white">Class of {profile.graduation_year}</p>
              </div>
            </div>
          )}
          {profile?.company && (
            <div className="flex items-center gap-3">
              <Briefcase size={16} className="text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p className="text-sm text-white">{profile.company}</p>
              </div>
            </div>
          )}
          {profile?.industry && (
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Industry</p>
                <p className="text-sm text-white">{profile.industry}</p>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        {alumni.skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map(s => (
                <span key={s.id} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">{s.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Discovery Page ── */
export default function AlumniDiscovery() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ skills: '', company: '', job_role: '', industry: '', graduation_year: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedAlumni, setSelectedAlumni] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-list', search, filters, page],
    queryFn: () => alumniApi.list({ search, ...filters, page }).then(r => r.data),
    keepPreviousData: true,
  })

  const alumni = data?.data ?? []
  const meta   = data?.meta ?? {}

  const clearFilters = () => { setFilters({ skills: '', company: '', job_role: '', industry: '', graduation_year: '' }); setSearch('') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Discover Alumni</h1>
        <span className="text-sm text-slate-400">{meta.total ?? 0} alumni found</span>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="search-wrapper flex-1">
          <Search size={16} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field search-input" placeholder="Search by name, company, role..." />
        </div>
        <button onClick={() => setShowFilters(v => !v)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${showFilters ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'}`}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input value={filters.skills} onChange={e => setFilters(p => ({ ...p, skills: e.target.value }))} className="input-field" placeholder="Skills (e.g., React, Python)" />
          <input value={filters.company} onChange={e => setFilters(p => ({ ...p, company: e.target.value }))} className="input-field" placeholder="Company" />
          <input value={filters.job_role} onChange={e => setFilters(p => ({ ...p, job_role: e.target.value }))} className="input-field" placeholder="Job role" />
          <select value={filters.industry} onChange={e => setFilters(p => ({ ...p, industry: e.target.value }))} className="input-field">
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <input value={filters.graduation_year} onChange={e => setFilters(p => ({ ...p, graduation_year: e.target.value }))} className="input-field" placeholder="Graduation year" type="number" min="2000" max="2030" />
          <button onClick={clearFilters} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm">
            <X size={14} /> Clear Filters
          </button>
        </div>
      )}

      {/* Alumni Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48"><div className="loading-spinner" /></div>
      ) : alumni.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map(a => (
            <AlumniCard key={a.id} a={a} onViewProfile={setSelectedAlumni} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p>No alumni found matching your criteria</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">Clear filters</button>
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Detail Modal/Drawer */}
      <AlumniDetailModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
    </div>
  )
}
