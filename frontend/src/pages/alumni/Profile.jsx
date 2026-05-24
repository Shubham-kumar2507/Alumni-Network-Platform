import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { profileApi } from '../../api'
import { Save, Camera, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Consulting', 'E-commerce', 'Manufacturing', 'Other']

export default function AlumniProfileEdit() {
  const { user, updateUser } = useAuth()
  const qc = useQueryClient()
  const [newSkill, setNewSkill] = useState('')

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['alumni-profile-me'],
    queryFn: () => profileApi.getAlumni().then(r => r.data)
  })

  const profile = profileData?.data

  const updateMut = useMutation({
    mutationFn: (data) => profileApi.updateAlumni(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['alumni-profile-me'])
      // Merge returned user data to avoid logout (don't replace entire user object)
      toast.success('Profile updated!')
    },
    onError: (err) => {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || 'Update failed'
      toast.error(msg)
    },
  })

  const syncSkillsMut = useMutation({
    mutationFn: (skills) => profileApi.syncSkills({ skills }),
    onSuccess: () => { qc.invalidateQueries(['alumni-profile-me']); toast.success('Skills updated!') },
    onError: () => toast.error('Failed to update skills'),
  })

  const avatarMut = useMutation({
    mutationFn: (file) => { const fd = new FormData(); fd.append('avatar', file); return profileApi.uploadAvatar(fd) },
    // NOTE: Do NOT call updateUser here — the avatar endpoint returns {avatar_url, message},
    // not a full user object. Calling updateUser with it would wipe the user's role and log them out.
    onSuccess: () => { qc.invalidateQueries(['alumni-profile-me']); toast.success('Avatar updated!') },
    onError: () => toast.error('Failed to upload avatar'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner" /></div>

  const skills = profile?.skills?.map(s => s.name) ?? []

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    updateMut.mutate(Object.fromEntries(data.entries()))
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    syncSkillsMut.mutate([...new Set([...skills, newSkill.trim()])])
    setNewSkill('')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold text-white">My Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
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
            <p className="text-xs text-emerald-400 mt-1">Alumni</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-5">Professional Info</h2>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Company</label>
            <input name="company" defaultValue={profile?.alumni?.company ?? ''} className="input-field" placeholder="Google, Amazon, ..." />
          </div>
          <div>
            <label className="form-label">Job Role</label>
            <input name="job_role" defaultValue={profile?.alumni?.job_role ?? ''} className="input-field" placeholder="Software Engineer" />
          </div>
          <div>
            <label className="form-label">Industry</label>
            <select name="industry" defaultValue={profile?.alumni?.industry ?? ''} className="input-field">
              <option value="">Select industry</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Years of Experience</label>
            <input name="experience_years" type="number" min="0" max="50" defaultValue={profile?.alumni?.experience_years ?? ''} className="input-field" />
          </div>
          <div>
            <label className="form-label">Graduation Year</label>
            <input name="graduation_year" type="number" min="1990" max="2030" defaultValue={profile?.alumni?.graduation_year ?? ''} className="input-field" />
          </div>
          <div>
            <label className="form-label">Open to Mentoring</label>
            <select name="is_mentor" defaultValue={profile?.alumni?.is_mentor ? '1' : '0'} className="input-field">
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          <div>
            <label className="form-label">LinkedIn</label>
            <input name="linkedin" defaultValue={profile?.alumni?.linkedin ?? ''} className="input-field" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className="form-label">GitHub</label>
            <input name="github" defaultValue={profile?.alumni?.github ?? ''} className="input-field" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="form-label">Mobile Number</label>
            <input name="phone" type="tel" defaultValue={profile?.alumni?.phone ?? ''} className="input-field" placeholder="+91 98765 43210" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Bio / About</label>
            <textarea name="bio" rows={3} defaultValue={profile?.alumni?.bio ?? ''} className="input-field resize-none" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={updateMut.isPending} className="btn-primary flex items-center gap-2">
              {updateMut.isPending ? <div className="loading-spinner !w-4 !h-4 !border-2" /> : <Save size={16} />} Save Profile
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/30">
              {s}
              <button onClick={() => syncSkillsMut.mutate(skills.filter(x => x !== s))} className="text-emerald-400 hover:text-red-400 transition-colors"><X size={12} /></button>
            </span>
          ))}
          {!skills.length && <p className="text-sm text-slate-500">No skills added</p>}
        </div>
        <div className="flex gap-2">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input-field flex-1" placeholder="Add a skill" />
          <button onClick={addSkill} className="btn-primary flex items-center gap-1"><Plus size={16} /> Add</button>
        </div>
      </div>
    </div>
  )
}
