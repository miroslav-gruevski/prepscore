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
              icon="🎭"
              title="4 Interviewer Personas"
              description="Practice with Technical, Skeptic, Friendly, and Rushed interviewer styles to prepare for any situation."
            />
            <FeatureCard
              icon="🤖"
              title="AI-Powered Analysis"
              description="Get detailed feedback on hiring signals like Problem Framing, Technical Depth, and Communication Clarity."
            />
            <FeatureCard
              icon="📊"
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

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass-card p-8 hover-lift">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-display font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
    </div>
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
