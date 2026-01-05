'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TrendingUp, Calendar, Target, Plus, ChevronDown, MoreVertical, Eye, Trash2 } from 'lucide-react'

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [showAll, setShowAll] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [user] = useState({
    name: "Test User",
    email: "test@example.com",
  })

  useEffect(() => {
    // Mock data
    setInterviews([
      {
        id: "1",
        roleDescription: "Senior React Engineer at Series B Startup",
        persona: "technical",
        questionType: "technical",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "1", name: "Problem Framing", score: 8 },
          { id: "2", name: "Technical Depth", score: 7 },
          { id: "3", name: "Code Quality", score: 9 },
        ],
      },
      {
        id: "2",
        roleDescription: "Staff Software Engineer at FAANG",
        persona: "skeptic",
        questionType: "behavioral",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "4", name: "Composure Under Pressure", score: 6 },
          { id: "5", name: "Evidence-Based Reasoning", score: 8 },
          { id: "6", name: "Receptiveness", score: 7 },
        ],
      },
    ])
  }, [])

  const avgScore = interviews.length > 0
    ? interviews.reduce((sum, interview) => {
        const avgSignalScore = interview.signalsDetected?.reduce((s: number, sig: any) => s + sig.score, 0) / (interview.signalsDetected?.length || 1)
        return sum + avgSignalScore
      }, 0) / interviews.length
    : 0

  const thisWeek = interviews.filter((i: any) => {
    const daysDiff = (Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length

  const displayedInterviews = showAll ? interviews : interviews.slice(0, 3)

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this interview session?')) {
      setInterviews(interviews.filter(i => i.id !== id))
      setOpenMenu(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                PrepScore
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-sunset-rose to-sunset-coral text-white rounded-full flex items-center justify-center font-semibold text-base shadow-lg">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-white mb-3">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-400">
            Track your progress and continue practicing
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard
            icon={Target}
            label="Total Interviews"
            value={interviews.length.toString()}
            subtitle="practice sessions"
            iconColor="text-sunset-rose"
          />
          <StatCard
            icon={Calendar}
            label="This Week"
            value={thisWeek.toString()}
            subtitle="interviews completed"
            iconColor="text-sunset-coral"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Score"
            value={`${avgScore.toFixed(1)}/10`}
            subtitle="across all signals"
            iconColor="text-sunset-plum"
          />
        </div>

        {/* Action Button */}
        <div className="mb-12">
          <Link href="/interview/new">
            <button className="btn-sunset w-full md:w-auto">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Start New Interview Practice
              </span>
            </button>
          </Link>
        </div>

        {/* Recent Interviews */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-white">
              Recent Sessions
            </h2>
            {interviews.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-sunset-rose hover:text-sunset-coral rounded-full transition-all text-sm font-semibold border-2 border-gray-700"
              >
                {showAll ? 'Show Less' : `View All (${interviews.length})`}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-16 text-center border-2 border-gray-700 shadow-lg">
              <div className="text-7xl mb-6">🎯</div>
              <h3 className="text-2xl font-display font-semibold text-white mb-3">
                No interviews yet
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                Start your first practice interview to get AI-powered feedback
              </p>
              <Link href="/interview/new">
                <button className="btn-sunset">
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {displayedInterviews.map((interview) => (
                <InterviewCard 
                  key={interview.id} 
                  interview={interview} 
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  iconColor,
}: {
  icon: any
  label: string
  value: string
  subtitle: string
  iconColor: string
}) {
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-medium text-gray-400 mb-2">{label}</p>
          <p className={`text-4xl font-display font-bold ${iconColor} mb-2`}>{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Icon className={`w-10 h-10 ${iconColor} opacity-70`} />
      </div>
    </div>
  )
}

function InterviewCard({ 
  interview, 
  openMenu, 
  setOpenMenu,
  onDelete 
}: { 
  interview: any
  openMenu: string | null
  setOpenMenu: (id: string | null) => void
  onDelete: (id: string) => void
}) {
  const personaEmojis = {
    technical: '👨‍💻',
    skeptic: '🤨',
    friendly: '😊',
    rushed: '⏱️',
  }

  const personaLabels = {
    technical: 'Technical',
    skeptic: 'Skeptical',
    friendly: 'Friendly',
    rushed: 'Rushed',
  }

  const avgScore = interview.signalsDetected?.reduce((sum: number, sig: any) => sum + sig.score, 0) / (interview.signalsDetected?.length || 1) || 0

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-900/20'
    if (score >= 6) return 'bg-yellow-900/20'
    return 'bg-red-900/20'
  }

  const isMenuOpen = openMenu === interview.id

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-700 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <Link href={`/interview/results/${interview.id}`} className="flex-1 group">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{personaEmojis[interview.persona as keyof typeof personaEmojis]}</span>
            <div>
              <h3 className="font-display font-semibold text-white text-xl group-hover:text-sunset-rose transition-colors">
                {interview.roleDescription}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span className="px-3 py-1 bg-sunset-rose/10 text-sunset-rose rounded-full text-xs font-medium">
                  {personaLabels[interview.persona as keyof typeof personaLabels]}
                </span>
                <span>•</span>
                <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {interview.signalsDetected && interview.signalsDetected.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {interview.signalsDetected.slice(0, 3).map((signal: any) => (
                <div
                  key={signal.id}
                  className="px-4 py-2 bg-gray-700 rounded-full text-xs font-medium text-gray-300"
                >
                  {signal.name}: {signal.score}/10
                </div>
              ))}
            </div>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <div className={`px-5 py-3 rounded-full font-semibold text-xl ${getScoreColor(avgScore)} ${getScoreBg(avgScore)}`}>
            {avgScore.toFixed(1)}/10
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button 
              onClick={() => setOpenMenu(isMenuOpen ? null : interview.id)}
              className="text-gray-400 hover:text-sunset-rose transition-colors p-2 hover:bg-gray-700 rounded-lg"
            >
              <MoreVertical className="w-6 h-6" />
            </button>

            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setOpenMenu(null)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <Link 
                    href={`/interview/results/${interview.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-gray-700 transition-colors text-white"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Eye className="w-5 h-5 text-sunset-rose" />
                    <span className="font-medium">View Session</span>
                  </Link>
                  <button
                    onClick={() => onDelete(interview.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-900/20 transition-colors text-red-400 border-t border-gray-700"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
