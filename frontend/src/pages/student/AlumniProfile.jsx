import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { alumniApi, connectionApi, mentorApi, referralApi } from '../../api'
import { Briefcase, GraduationCap, Link2, GitFork, Star, GitBranch, ArrowLeft, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AlumniProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mentorMsg, setMentorMsg] = useState('')
  const [referralJob, setReferralJob] = useState('')
  const [referralMsg, setReferralMsg] = useState('')
  const [showMentorForm, setShowMentorForm] = useState(false)
  const [showReferralForm, setShowReferralForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-profile', id],
    queryFn: () => alumniApi.get(id).then(r => r.data)
  })

  const alumni = data?.data

  const connectMut = useMutation({
    mutationFn: () => connectionApi.send({ receiver_id: id }),
    onSuccess: () => toast.success('Connection request sent!'),
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to send request'),
  })

  const mentorMut = useMutation({
    mutationFn: () => mentorApi.request({ alumni_id: id, message: mentorMsg }),
    onSuccess: () => { toast.success('Mentor request sent!'); setShowMentorForm(false); setMentorMsg('') },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to send request'),
  })

  const referralMut = useMutation({
    mutationFn: () => referralApi.request({ alumni_id: id, job_title: referralJob, message: referralMsg }),
    onSuccess: () => { toast.success('Referral request sent!'); setShowReferralForm(false); setReferralJob(''); setReferralMsg('') },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to send request'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>
  if (!alumni) return <div className="text-center py-16 text-slate-500">Alumni not found</div>

  const profile = alumni.alumni

  return (
    <div className="max-w-2xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Discovery
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 overflow-hidden">
            {alumni.avatar ? <img src={`/storage/${alumni.avatar}`} className="w-full h-full object-cover" alt="" /> : alumni.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{alumni.name}</h1>
            <p className="text-sm text-emerald-400">{profile?.job_role} {profile?.company && `@ ${profile.company}`}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile?.industry} • {profile?.experience_years} yrs exp</p>
            <div className="flex gap-3 mt-3">
              {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Link2 size={18} /></a>}
              {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><GitFork size={18} /></a>}
            </div>
          </div>
        </div>
        {profile?.bio && <p className="mt-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">{profile.bio}</p>}

        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => connectMut.mutate()} disabled={connectMut.isPending} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors">
            <GitBranch size={15} /> Connect
          </button>
          <button onClick={() => setShowMentorForm(v => !v)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-sm font-medium transition-colors">
            <Star size={15} /> Request Mentor
          </button>
          <button onClick={() => setShowReferralForm(v => !v)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-sm font-medium transition-colors">
            <Briefcase size={15} /> Ask Referral
          </button>
        </div>
      </div>

      {/* Mentor Form */}
      {showMentorForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-3">Request Mentorship</h3>
          <textarea value={mentorMsg} onChange={e => setMentorMsg(e.target.value)} rows={3} className="input-field resize-none mb-3" placeholder="Tell them what you'd like guidance on..." />
          <button onClick={() => mentorMut.mutate()} disabled={mentorMut.isPending} className="btn-primary flex items-center gap-2">
            {mentorMut.isPending ? <div className="loading-spinner !w-4 !h-4 !border-2" /> : <Star size={15} />} Send Request
          </button>
        </div>
      )}

      {/* Referral Form */}
      {showReferralForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-3">Request Referral</h3>
          <input value={referralJob} onChange={e => setReferralJob(e.target.value)} className="input-field mb-3" placeholder="Job title / Position you're applying for" />
          <textarea value={referralMsg} onChange={e => setReferralMsg(e.target.value)} rows={3} className="input-field resize-none mb-3" placeholder="Tell them why you'd be a good fit..." />
          <button onClick={() => referralMut.mutate()} disabled={referralMut.isPending} className="btn-primary flex items-center gap-2">
            {referralMut.isPending ? <div className="loading-spinner !w-4 !h-4 !border-2" /> : <Briefcase size={15} />} Send Request
          </button>
        </div>
      )}

      {/* Skills */}
      {alumni.skills?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {alumni.skills.map(s => (
              <span key={s.id} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">{s.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile?.graduation_year && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><GraduationCap size={16} className="text-emerald-400" /> Education</h2>
          <p className="text-sm text-slate-300">Class of {profile.graduation_year}</p>
        </div>
      )}
    </div>
  )
}
