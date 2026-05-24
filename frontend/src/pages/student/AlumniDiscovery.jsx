import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { alumniApi } from '../../api'
import { Search, Filter, MapPin, Briefcase, GraduationCap, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Consulting', 'E-commerce', 'Other']

export default function AlumniDiscovery() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ skills: '', company: '', job_role: '', industry: '', graduation_year: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-list', search, filters, page],
    queryFn: () => alumniApi.list({ search, ...filters, page }).then(r => r.data),
    keepPreviousData: true,
  })

  const alumni = data?.data ?? []
  const meta = data?.meta ?? {}

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

      {/* Filter Panel */}
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
            <Link key={a.id} to={`/student/alumni/${a.id}`} className="card p-5 hover:border-indigo-500/40 hover:scale-[1.02] transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                  {a.avatar ? <img src={`/storage/${a.avatar}`} className="w-full h-full object-cover" alt="" /> : a.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{a.name}</p>
                  <p className="text-xs text-slate-400 truncate">{a.alumni?.job_role ?? 'Alumni'}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                {a.alumni?.company && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={12} />
                    <span className="truncate">{a.alumni.company}</span>
                  </div>
                )}
                {a.alumni?.industry && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span className="truncate">{a.alumni.industry}</span>
                  </div>
                )}
                {a.alumni?.graduation_year && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    <span>Class of {a.alumni.graduation_year}</span>
                  </div>
                )}
              </div>

              {a.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {a.skills.slice(0, 3).map(s => (
                    <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">{s.name}</span>
                  ))}
                  {a.skills.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">+{a.skills.length - 3}</span>}
                </div>
              )}

              <div className="flex items-center justify-end mt-3 text-indigo-400 text-xs font-medium">
                View Profile <ChevronRight size={14} className="ml-1" />
              </div>
            </Link>
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
    </div>
  )
}
