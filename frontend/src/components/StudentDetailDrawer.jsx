import { GraduationCap, MapPin, Link2, GitFork, X, ArrowLeft, Phone, User } from 'lucide-react'

/**
 * Reusable Student Detail Drawer
 * Props:
 *   student — the student user object (with .student sub-object and .skills array)
 *   onClose — close handler
 */
export default function StudentDetailDrawer({ student, onClose }) {
  if (!student) return null
  const profile = student.student

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
              {student.avatar
                ? <img src={`/storage/${student.avatar}`} className="w-full h-full object-cover" alt="" />
                : student.name?.charAt(0)?.toUpperCase()
              }
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">{student.name}</h2>
              <p className="text-sm text-indigo-400">Student</p>
              <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
              {/* Social links */}
              <div className="flex gap-3 mt-2">
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank" rel="noreferrer"
                    title="LinkedIn"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Link2 size={16} />
                  </a>
                )}
                {profile?.github && (
                  <a
                    href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                    target="_blank" rel="noreferrer"
                    title="GitHub"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
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

          {/* Details card */}
          <div className="card p-4 space-y-3">
            {profile?.branch && (
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Branch</p>
                  <p className="text-sm text-white">{profile.branch}</p>
                </div>
              </div>
            )}
            {profile?.college && (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">College</p>
                  <p className="text-sm text-white">{profile.college}</p>
                </div>
              </div>
            )}
            {profile?.graduation_year && (
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Graduation Year</p>
                  <p className="text-sm text-white">{profile.graduation_year}</p>
                </div>
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm text-white">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {student.skills.map(s => (
                  <span
                    key={s.id ?? s.name}
                    className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!profile && (
            <div className="text-center py-10 text-slate-500">
              <User size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No profile details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
