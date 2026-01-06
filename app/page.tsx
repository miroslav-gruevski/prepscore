'use client'

import Link from 'next/link'
import { CheckCircle2, Sparkles, User, Users, Target, Briefcase, Award, GraduationCap, MessageSquare, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/PrepScore-symbol.svg" alt="" className="w-7 h-7" />
              <span className="text-xl font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                PrepScore
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="btn-primary !px-5 !py-2.5 !rounded-xl text-sm press-effect">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Floating Avatars Background */}
        <FloatingAvatars />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 badge badge-primary mb-10">
            <Sparkles className="w-4 h-4" />
            AI-Powered Interview Practice
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
            Master your interview skills<br/>with{' '}
            <span className="bg-gradient-to-r from-sunset-coral via-sunset-rose to-sunset-plum bg-clip-text text-transparent">
              AI-powered
              <br/>
              feedback
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Practice with realistic interview scenarios, get instant analysis, and track your
            improvement across multiple sessions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/interview/new">
              <button className="btn-primary !px-8 !py-4 !rounded-2xl text-lg hover-glow">
                <span className="flex items-center gap-2">
                  Start Practicing Now
                  <Sparkles className="w-5 h-5" />
                </span>
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-outlined !px-8 !py-4 !rounded-2xl text-lg">
                View Dashboard
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-8 justify-center items-center text-sm text-gray-400">
            {[
              { text: 'Free to start' },
              { text: 'No credit card' },
              { text: 'Instant feedback' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CheckCircle2 className="w-5 h-5 text-sunset-coral" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools designed to help you practice and improve your interview performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            <FeatureCard
              icon={<PersonasIcon />}
              title="4 Interviewer Personas"
              description="Practice with Technical, Skeptic, Friendly, and Rushed interviewer styles to prepare for any situation."
            />
            <FeatureCard
              icon={<AIAnalysisIcon />}
              title="AI-Powered Analysis"
              description="Get detailed feedback on hiring signals like Problem Framing, Technical Depth, and Communication Clarity."
            />
            <FeatureCard
              icon={<ProgressIcon />}
              title="Progress Tracking"
              description="Track improvement across 5 dimensions: Clarity, Depth, Pressure Handling, Role Fit, and Visibility."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-300">
              Simple, effective, and designed for your success
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { step: '1', title: 'Choose Your Role', desc: "Select the position you're interviewing for", icon: '🎯' },
              { step: '2', title: 'Pick a Persona', desc: 'Choose from 4 interviewer styles', icon: '🎭' },
              { step: '3', title: 'Practice', desc: 'Record your response to interview questions', icon: '🎥' },
              { step: '4', title: 'Get Feedback', desc: 'Receive AI-powered analysis and insights', icon: '📈' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-20 h-20 mx-auto bg-sunset-rose/10 text-sunset-rose rounded-full flex items-center justify-center text-2xl font-display font-bold mb-6 shadow-lg border-2 border-sunset-rose/30">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display font-semibold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 gradient-sunset">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to ace your next interview?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands improving their interview skills with AI-powered feedback
          </p>
          <Link href="/interview/new">
            <button className="px-10 py-5 bg-white text-sunset-rose font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 hover:scale-105 text-lg">
              Start Practicing Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 PrepScore. Built for practice, not cheating.
            </p>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-sunset-rose transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-sunset-rose transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-sunset-rose transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-8 hover-lift">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-display font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
    </div>
  )
}

// Custom 3D-style SVG icons with gradients
function PersonasIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="personas-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#FF8E53" />
          <stop offset="100%" stopColor="#FFA07A" />
        </linearGradient>
        <linearGradient id="personas-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A1942" />
          <stop offset="100%" stopColor="#2D1B36" />
        </linearGradient>
        <filter id="personas-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Shadow/3D effect */}
      <ellipse cx="28" cy="50" rx="20" ry="4" fill="url(#personas-shadow)" opacity="0.3"/>
      {/* Back mask - smaller */}
      <path d="M42 16C42 16 44 18 44 22C44 26 42 30 38 32C34 34 30 34 30 34L32 38C32 38 40 36 44 30C48 24 48 18 44 14C40 10 34 10 30 12L30 16C30 16 36 14 40 16C42 17 42 16 42 16Z" fill="url(#personas-gradient)" opacity="0.6"/>
      {/* Main mask */}
      <g filter="url(#personas-glow)">
        <path d="M12 20C12 12 18 6 28 6C38 6 44 12 44 20C44 28 40 36 34 40C28 44 22 44 22 44L20 50L18 44C18 44 12 44 8 38C4 32 4 24 8 18C12 12 20 10 28 10C28 10 20 10 16 14C12 18 12 24 14 28C16 32 20 34 24 34C24 34 20 32 18 28C16 24 16 20 18 16C20 12 24 10 28 10" stroke="url(#personas-gradient)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Face details */}
        <circle cx="22" cy="22" r="2.5" fill="url(#personas-gradient)"/>
        <circle cx="32" cy="22" r="2.5" fill="url(#personas-gradient)"/>
        <path d="M24 30C24 30 27 33 32 30" stroke="url(#personas-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  )
}

function AIAnalysisIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9FF" />
          <stop offset="50%" stopColor="#00B4D8" />
          <stop offset="100%" stopColor="#0096C7" />
        </linearGradient>
        <linearGradient id="ai-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90E0EF" />
          <stop offset="100%" stopColor="#48CAE4" />
        </linearGradient>
        <filter id="ai-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Shadow */}
      <ellipse cx="28" cy="52" rx="18" ry="3" fill="#0A1628" opacity="0.4"/>
      {/* Robot head */}
      <g filter="url(#ai-glow)">
        {/* Antenna */}
        <circle cx="28" cy="6" r="3" fill="url(#ai-accent)"/>
        <line x1="28" y1="9" x2="28" y2="14" stroke="url(#ai-gradient)" strokeWidth="2"/>
        {/* Head */}
        <rect x="12" y="14" width="32" height="28" rx="6" stroke="url(#ai-gradient)" strokeWidth="2.5" fill="none"/>
        {/* Eyes */}
        <rect x="18" y="22" width="8" height="8" rx="2" fill="url(#ai-gradient)"/>
        <rect x="30" y="22" width="8" height="8" rx="2" fill="url(#ai-gradient)"/>
        {/* Eye highlights */}
        <circle cx="20" cy="24" r="1.5" fill="#fff" opacity="0.8"/>
        <circle cx="32" cy="24" r="1.5" fill="#fff" opacity="0.8"/>
        {/* Mouth/speaker */}
        <rect x="20" y="34" width="16" height="4" rx="2" stroke="url(#ai-gradient)" strokeWidth="1.5" fill="none"/>
        <line x1="24" y1="35" x2="24" y2="37" stroke="url(#ai-accent)" strokeWidth="1.5"/>
        <line x1="28" y1="35" x2="28" y2="37" stroke="url(#ai-accent)" strokeWidth="1.5"/>
        <line x1="32" y1="35" x2="32" y2="37" stroke="url(#ai-accent)" strokeWidth="1.5"/>
        {/* Ears/side panels */}
        <rect x="6" y="22" width="4" height="12" rx="2" fill="url(#ai-gradient)"/>
        <rect x="46" y="22" width="4" height="12" rx="2" fill="url(#ai-gradient)"/>
      </g>
      {/* Circuit lines */}
      <path d="M8 46H16L20 42H36L40 46H48" stroke="url(#ai-accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

function ProgressIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
        <linearGradient id="progress-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="progress-red" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
        <filter id="progress-glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Shadow */}
      <ellipse cx="28" cy="52" rx="20" ry="3" fill="#0A1628" opacity="0.4"/>
      {/* Chart frame */}
      <g filter="url(#progress-glow)">
        {/* Y axis */}
        <line x1="10" y1="8" x2="10" y2="44" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
        {/* X axis */}
        <line x1="10" y1="44" x2="50" y2="44" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
        {/* Bars */}
        <rect x="14" y="34" width="6" height="10" rx="1" fill="url(#progress-red)"/>
        <rect x="24" y="26" width="6" height="18" rx="1" fill="url(#progress-accent)"/>
        <rect x="34" y="16" width="6" height="28" rx="1" fill="url(#progress-gradient)"/>
        {/* Trend line */}
        <path d="M17 32L27 24L37 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        {/* Arrow up */}
        <path d="M37 12L42 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 8L38 8M42 8L42 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Grid lines */}
        <line x1="10" y1="28" x2="50" y2="28" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
        <line x1="10" y1="18" x2="50" y2="18" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
      </g>
    </svg>
  )
}

// Floating Avatars Component - Subtle background animation with line icons
function FloatingAvatars() {
  const avatars = [
    { Icon: User, delay: '0s', duration: '20s', x: '10%', y: '20%', size: 32 },
    { Icon: Users, delay: '2s', duration: '25s', x: '85%', y: '15%', size: 28 },
    { Icon: Target, delay: '4s', duration: '22s', x: '15%', y: '70%', size: 36 },
    { Icon: Briefcase, delay: '1s', duration: '24s', x: '80%', y: '65%', size: 30 },
    { Icon: Award, delay: '3s', duration: '28s', x: '5%', y: '45%', size: 34 },
    { Icon: MessageSquare, delay: '5s', duration: '26s', x: '90%', y: '40%', size: 32 },
    { Icon: GraduationCap, delay: '2.5s', duration: '23s', x: '25%', y: '85%', size: 38 },
    { Icon: TrendingUp, delay: '4.5s', duration: '27s', x: '75%', y: '90%', size: 30 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      {avatars.map((avatar, i) => {
        const IconComponent = avatar.Icon
        return (
          <div
            key={i}
            className="absolute animate-float-scale"
            style={{
              left: avatar.x,
              top: avatar.y,
              animationDelay: avatar.delay,
              animationDuration: avatar.duration,
            }}
          >
            <IconComponent 
              size={avatar.size} 
              className="text-sunset-coral stroke-[1.5]" 
              strokeWidth={1.5}
            />
          </div>
        )
      })}
    </div>
  )
}
