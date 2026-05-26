import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  GraduationCap, Users, Star, Briefcase, MessageSquare,
  CalendarDays, Zap, ArrowRight, Globe, Share2, Link as LinkIcon,
  Mail, Phone, MapPin, ChevronRight, Network, Award, Sun, Moon
} from 'lucide-react'

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

/* ── Stats counter card ── */
function StatCard({ value, label, suffix = '+', duration, active }) {
  const count = useCounter(value, duration, active)
  return (
    <div className="text-center">
      <div className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <p className="text-slate-400 mt-2 font-medium">{label}</p>
    </div>
  )
}

const FEATURES = [
  { icon: Network,      color: 'from-indigo-500 to-purple-600',  title: 'Alumni Networking',     desc: 'Connect with a vast alumni network across industries and companies worldwide.' },
  { icon: Star,         color: 'from-emerald-500 to-teal-600',   title: 'Mentorship Program',    desc: 'Get guided by experienced alumni who\'ve walked the same path and succeeded.' },
  { icon: Briefcase,    color: 'from-amber-500 to-orange-600',   title: 'Referral System',       desc: 'Receive job referrals directly from alumni working at top companies.' },
  { icon: MessageSquare,color: 'from-cyan-500 to-blue-600',      title: 'Real-time Chat',        desc: 'Message mentors and connections instantly with our built-in chat system.' },
  { icon: CalendarDays, color: 'from-pink-500 to-rose-600',      title: 'Event Participation',   desc: 'Join webinars, job fairs, internship drives and campus meetups.' },
  { icon: Zap,          color: 'from-violet-500 to-indigo-600',  title: 'Smart Recommendations', desc: 'Get matched with the right mentors based on your field and career goals.' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma',   role: 'B.Tech CSE 2024', avatar: 'P', quote: 'AlumniNet helped me land my first job through a referral from a senior. The mentorship I received was invaluable!', type: 'student' },
  { name: 'Rahul Verma',    role: 'SDE @ Google',    avatar: 'R', quote: 'Giving back to my college community through mentoring is seamless on AlumniNet. Love the platform!', type: 'alumni' },
  { name: 'Anjali Singh',   role: 'MBA 2023',         avatar: 'A', quote: 'Found an amazing internship through the referral system. The alumni network here is incredibly active.', type: 'student' },
  { name: 'Vikram Malhotra',role: 'PM @ Microsoft',   avatar: 'V', quote: 'AlumniNet makes it easy to stay connected with my alma mater and support the next generation.', type: 'alumni' },
]

export default function LandingPage() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">AlumniNet</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-6">
                <Zap size={14} /> Platform for Students & Alumni
              </div>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                Connect,{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Learn,
                </span>{' '}
                and Grow with{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  AlumniNet
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                Build meaningful connections with alumni, mentors, and opportunities. Your next career breakthrough starts with the right connection.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105">
                  Login <ArrowRight size={16} />
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all hover:scale-105">
                  Register <ChevronRight size={16} />
                </Link>
                <a href="#features" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors font-medium">
                  Explore Features
                </a>
              </div>

              {/* Mini stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-800">
                {[['500+','Alumni'],['200+','Students'],['50+','Mentors']].map(([v,l]) => (
                  <div key={l}>
                    <p className="text-2xl font-bold text-white">{v}</p>
                    <p className="text-sm text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl blur-xl" />
              <img
                src="/hero-illustration.png"
                alt="AlumniNet Network Illustration"
                className="relative rounded-2xl w-full max-w-lg object-cover shadow-2xl shadow-indigo-900/40 border border-slate-700/50"
              />
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white font-medium">247 Alumni Online</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm text-white font-medium">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              AlumniNet brings together powerful tools to help students find mentors, opportunities, and build lasting professional relationships.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-20 px-6 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-y border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Trusted by the Community</h2>
            <p className="text-slate-400">Growing stronger every day with an active and engaged network.</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <StatCard value={500}  label="Alumni Members"  suffix="+" duration={2000} active={statsVisible} />
            <StatCard value={200}  label="Active Students" suffix="+" duration={1600} active={statsVisible} />
            <StatCard value={50}   label="Expert Mentors"  suffix="+" duration={1200} active={statsVisible} />
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">
              Why <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AlumniNet?</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              AlumniNet was built to bridge the gap between students and alumni. We believe that the best way to grow professionally is through real connections with people who've been where you are.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Our platform provides structured mentorship, referral pathways, and networking opportunities that are tailored to your career goals — all in one place.
            </p>
            <div className="space-y-4">
              {[
                ['Real-Time Messaging', 'Chat directly with mentors and connections instantly'],
                ['Verified Alumni',     'All alumni profiles are institution-verified'],
                ['Career Opportunities','Browse referrals, internships and job postings'],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-slate-500 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users,         label: 'Networking',   color: 'from-indigo-500 to-purple-600', stat: '500+' },
              { icon: Star,          label: 'Mentorship',   color: 'from-emerald-500 to-teal-600',  stat: '50+'  },
              { icon: Briefcase,     label: 'Referrals',    color: 'from-amber-500 to-orange-600',  stat: '300+' },
              { icon: CalendarDays,  label: 'Events',       color: 'from-pink-500 to-rose-600',     stat: '100+' },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <p className="text-2xl font-black text-white">{item.stat}</p>
                <p className="text-slate-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">What Our Community Says</h2>
            <p className="text-slate-400 text-lg">Real stories from students and alumni who found success through AlumniNet.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${t.type === 'alumni' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/30 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
            </div>
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">Join AlumniNet Today</h2>
              <p className="text-indigo-200/70 text-lg mb-8 max-w-xl mx-auto">
                Start building your professional network. Connect with mentors, explore opportunities, and grow your career.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/register" className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold transition-all hover:scale-105">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-slate-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">AlumniNet</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Connecting students and alumni for meaningful career growth and mentorship.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { icon: Globe, href: 'https://www.alumniNet.in', label: 'Website' },
                  { icon: Share2, href: 'https://www.linkedin.com/company/alumniNet', label: 'LinkedIn' },
                  { icon: LinkIcon, href: 'https://twitter.com/alumniNet', label: 'Twitter' }
                ].map(({ icon: Icon, href, label }, i) => (
                  <a 
                    key={i} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={label}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Platform</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Mentorship', href: '#about' },
                  { label: 'Alumni Network', href: '/alumni' },
                  { label: 'Events', href: '/alumni' },
                  { label: 'Referrals', href: '/alumni' }
                ].map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('#') ? (
                      <a href={href} className="hover:text-white transition-colors cursor-pointer">{label}</a>
                    ) : (
                      <Link to={href} className="hover:text-white transition-colors">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Account</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={14} /> 
                  <a href="mailto:alumni@alumniNet.in" className="hover:underline">alumni@alumniNet.in</a>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={14} /> 
                  <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <MapPin size={14} /> Punjab, India
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p>© {new Date().getFullYear()} AlumniNet. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</a>
            </div>
            <button 
              onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200"
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? (
                <>
                  <Sun size={16} />
                  <span className="text-xs font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span className="text-xs font-medium">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
