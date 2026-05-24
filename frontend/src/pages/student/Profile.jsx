import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { profileApi } from '../../api'
import { User, GitFork, Link2, Upload, Plus, X, Save, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'Other']
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i + 4)

export default function StudentProfile() {
  const { user, updateUser } = useAuth()
  const qc = useQueryClient()
  const [newSkill, setNewSkill] = useState('')

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => profileApi.getStudent().then(r => r.data)
  })

  const profile = profileData?.data
  const [form, setForm] = useState({})

  const updateMut = useMutation({
    mutationFn: (data) => profileApi.updateStudent(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['student-profile'])
      updateUser(res.data.data)
      toast.success('Profile updated!')
    },
    onError: (err) => {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || 'Update failed'
      toast.error(msg)
    },
  })

  const syncSkillsMut = useMutation({
    mutationFn: (skills) => profileApi.syncSkills({ skills }),
    onSuccess: () => { qc.invalidateQueries(['student-profile']); toast.success('Skills updated!') },
    onError: () => toast.error('Failed to update skills'),
  })

  const avatarMut = useMutation({
    mutationFn: (file) => { const fd = new FormData(); fd.append('avatar', file); return profileApi.uploadAvatar(fd) },
    // IMPORTANT: Do NOT call updateUser with avatar response — it returns {avatar_url, message},
    // not a full user object. Would wipe user.role and trigger a logout.
    onSuccess: () => { qc.invalidateQueries(['student-profile']); toast.success('Avatar updated!') },
    onError: () => toast.error('Failed to upload avatar'),
  })

  const resumeMut = useMutation({
    mutationFn: (file) => { const fd = new FormData(); fd.append('resume', file); return profileApi.uploadResume(fd) },
    onSuccess: () => toast.success('Resume uploaded!'),
    onError: () => toast.error('Failed to upload resume'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  const skills = profile?.skills?.map(s => s.name) ?? []

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const payload = Object.fromEntries(data.entries())
    updateMut.mutate(payload)
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    const updated = [...new Set([...skills, newSkill.trim()])]
    syncSkillsMut.mutate(updated)
    setNewSkill('')
  }

  const removeSkill = (skill) => {
    syncSkillsMut.mutate(skills.filter(s => s !== skill))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Profile</h1>
      </div>

      {/* Avatar */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {user?.avatar ? <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
              <Camera size={13} className="text-slate-300" />
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && avatarMut.mutate(e.target.files[0])} />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <p className="text-xs text-indigo-400 mt-1">Student</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-5">Academic Info</h2>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Branch</label>
            <select name="branch" defaultValue={profile?.student?.branch ?? ''} className="input-field">
              <option value="">Select branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Graduation Year</label>
            <select name="graduation_year" defaultValue={profile?.student?.graduation_year ?? ''} className="input-field">
              <option value="">Select year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">College</label>
            <input name="college" defaultValue={profile?.student?.college ?? ''} className="input-field" placeholder="Your college name" />
          </div>
          <div>
            <label className="form-label">LinkedIn</label>
            <input name="linkedin" defaultValue={profile?.student?.linkedin ?? ''} className="input-field" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className="form-label">GitHub</label>
            <input name="github" defaultValue={profile?.student?.github ?? ''} className="input-field" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="form-label">Mobile Number</label>
            <input name="phone" type="tel" defaultValue={profile?.student?.phone ?? ''} className="input-field" placeholder="+91 98765 43210" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Bio / About</label>
            <textarea name="bio" rows={3} defaultValue={profile?.student?.bio ?? ''} className="input-field resize-none" placeholder="Tell alumni about yourself..." />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={updateMut.isPending} className="btn-primary flex items-center gap-2">
              {updateMut.isPending ? <div className="loading-spinner !w-4 !h-4 !border-2" /> : <Save size={16} />}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Skills */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.length ? skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">
              {s}
              <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          )) : <p className="text-sm text-slate-500">No skills added yet</p>}
        </div>
        <div className="flex gap-2">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input-field flex-1" placeholder="Add a skill (e.g., React, Python)" />
          <button onClick={addSkill} disabled={syncSkillsMut.isPending} className="btn-primary flex items-center gap-1">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Resume */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Resume</h2>
        <label className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500/50 cursor-pointer transition-colors group">
          <Upload size={20} className="text-slate-500 group-hover:text-indigo-400" />
          <div className="text-center">
            <p className="text-sm text-slate-400 group-hover:text-slate-200">Click to upload resume (PDF)</p>
            {profile?.student?.resume_path && <p className="text-xs text-indigo-400 mt-1">Current: {profile.student.resume_path.split('/').pop()}</p>}
          </div>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => e.target.files[0] && resumeMut.mutate(e.target.files[0])} />
        </label>
      </div>
    </div>
  )
}
