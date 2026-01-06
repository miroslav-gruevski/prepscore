'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Calendar, Target, Plus, ChevronDown, MoreVertical, Eye, Trash2, Clock, Settings, LogOut, User, HelpCircle, CreditCard, AlertTriangle, X } from 'lucide-react'

interface Interview {
  id: string
  roleDescription: string
  persona: string
  questionType: string
  createdAt: string
  analyzedAt: string
  signalsDetected: { id: string; name: string; score: number }[]
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; interview: Interview | null }>({ open: false, interview: null })
  const [user] = useState({
    name: "Test User",
    email: "test@example.com",
  })
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  useEffect(() => {
    // Mock data with more items across different days
    const mockInterviews: Interview[] = [
      // Today
      {
        id: "1",
        roleDescription: "Senior React Engineer at Series B Startup",
        persona: "technical",
        questionType: "technical",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "1", name: "Problem Framing", score: 8 },
          { id: "2", name: "Technical Depth", score: 7 },
          { id: "3", name: "Code Quality", score: 9 },
        ],
      },
      {
        id: "2",
        roleDescription: "Product Manager at Tech Company",
        persona: "friendly",
        questionType: "behavioral",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        analyzedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "4", name: "Communication", score: 8 },
          { id: "5", name: "Strategic Thinking", score: 9 },
        ],
      },
      // Yesterday
      {
        id: "3",
        roleDescription: "Staff Software Engineer at FAANG",
        persona: "skeptic",
        questionType: "behavioral",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "6", name: "Composure Under Pressure", score: 6 },
          { id: "7", name: "Evidence-Based Reasoning", score: 8 },
          { id: "8", name: "Receptiveness", score: 7 },
        ],
      },
      {
        id: "4",
        roleDescription: "Engineering Manager at Growth Startup",
        persona: "rushed",
        questionType: "leadership",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "9", name: "Leadership", score: 7 },
          { id: "10", name: "Decision Making", score: 8 },
        ],
      },
      // 2 days ago
      {
        id: "5",
        roleDescription: "Frontend Developer at Agency",
        persona: "technical",
        questionType: "technical",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "11", name: "CSS Architecture", score: 9 },
          { id: "12", name: "React Patterns", score: 8 },
        ],
      },
      // 5 days ago
      {
        id: "6",
        roleDescription: "DevOps Engineer at Enterprise",
        persona: "technical",
        questionType: "system_design",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "13", name: "Infrastructure", score: 7 },
          { id: "14", name: "Automation", score: 8 },
        ],
      },
      // 7 days ago
      {
        id: "7",
        roleDescription: "UX Designer at Product Studio",
        persona: "friendly",
        questionType: "behavioral",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "15", name: "Design Thinking", score: 9 },
          { id: "16", name: "User Empathy", score: 8 },
        ],
      },
      // 10 days ago
      {
        id: "8",
        roleDescription: "Data Scientist at AI Startup",
        persona: "skeptic",
        questionType: "technical",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        analyzedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        signalsDetected: [
          { id: "17", name: "ML Fundamentals", score: 8 },
          { id: "18", name: "Statistical Rigor", score: 7 },
        ],
      },
    ]
    // Simulate API loading time
    setTimeout(() => {
      setInterviews(mockInterviews)
      setIsLoading(false)
    }, 800)
  }, [])

  const avgScore = interviews.length > 0
    ? interviews.reduce((sum, interview) => {
        const avgSignalScore = interview.signalsDetected?.reduce((s: number, sig) => s + sig.score, 0) / (interview.signalsDetected?.length || 1)
        return sum + avgSignalScore
      }, 0) / interviews.length
    : 0

  const thisWeek = interviews.filter((i) => {
    const daysDiff = (Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length

  // Group interviews by day
  const groupByDay = (items: Interview[]) => {
    const groups: { [key: string]: Interview[] } = {}
    
    items.forEach(interview => {
      const date = new Date(interview.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      let key: string
      if (date.toDateString() === today.toDateString()) {
        key = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday'
      } else {
        key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      }
      
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(interview)
    })
    
    return groups
  }

  const displayedInterviews = showAll ? interviews : interviews.slice(0, 5)
  const groupedInterviews = showAll ? groupByDay(interviews) : null

  const openDeleteModal = (interview: Interview) => {
    setDeleteModal({ open: true, interview })
    setOpenMenu(null)
  }

  const confirmDelete = () => {
    if (deleteModal.interview) {
      setInterviews(interviews.filter(i => i.id !== deleteModal.interview!.id))
    }
    setDeleteModal({ open: false, interview: null })
  }

  const cancelDelete = () => {
    setDeleteModal({ open: false, interview: null })
  }

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fixed Header */}
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
              <Link href="/interview/new">
                <button className="btn-primary flex items-center gap-2 !px-4 !py-2.5 !rounded-xl text-sm">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Interview</span>
                </button>
              </Link>
              
              {/* User Avatar Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 bg-gradient-to-br from-sunset-rose to-sunset-coral text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg shadow-sunset-coral/20 hover:shadow-xl hover:shadow-sunset-coral/30 hover:scale-105 transition-all duration-300 cursor-pointer press-effect"
                >
                  {user.name.charAt(0)}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 glass-dropdown z-[70] overflow-hidden animate-scale-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      
                      {/* Menu Items - Static (coming soon) */}
                      <div className="py-2">
                        <div className="flex items-center gap-3 px-4 py-2.5 text-gray-500 text-sm cursor-default">
                          <User className="w-4 h-4" />
                          Profile
                          <span className="ml-auto text-xs text-gray-600">Soon</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-gray-500 text-sm cursor-default">
                          <Settings className="w-4 h-4" />
                          Settings
                          <span className="ml-auto text-xs text-gray-600">Soon</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-gray-500 text-sm cursor-default">
                          <CreditCard className="w-4 h-4" />
                          Subscription
                          <span className="ml-auto text-xs text-gray-600">Soon</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-gray-500 text-sm cursor-default">
                          <HelpCircle className="w-4 h-4" />
                          Help & Support
                          <span className="ml-auto text-xs text-gray-600">Soon</span>
                        </div>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-white/10 py-2">
                        <button
                          onClick={() => { setUserMenuOpen(false); alert('Logout clicked - implement auth'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <main id="main-content" className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section - More compact */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            Track your progress and continue practicing
          </p>
        </div>

        {/* Stats Cards - More compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            // Skeleton stats
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card-subtle p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="w-5 h-5 skeleton rounded" />
                  </div>
                  <div>
                    <div className="w-20 h-4 skeleton rounded mb-2" />
                    <div className="w-12 h-6 skeleton rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={Target}
                label="Total Sessions"
                value={interviews.length.toString()}
                iconColor="text-sunset-rose"
              />
              <StatCard
                icon={Calendar}
                label="This Week"
                value={thisWeek.toString()}
                iconColor="text-sunset-coral"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Score"
                value={`${avgScore.toFixed(1)}/10`}
                iconColor="text-green-400"
              />
            </>
          )}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">
              Recent Sessions
            </h2>
            {interviews.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn-ghost flex items-center gap-2 !px-4 !py-2 text-sm press-effect"
              >
                {showAll ? 'Show Less' : `View All (${interviews.length})`}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {isLoading ? (
            // Skeleton loading state
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="w-48 h-5 bg-gray-700 rounded mb-2" />
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-4 bg-gray-700 rounded" />
                        <div className="w-16 h-4 bg-gray-700 rounded" />
                      </div>
                    </div>
                    <div className="w-12 h-8 bg-gray-700 rounded-lg" />
                    <div className="w-6 h-6 bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start your first practice interview to get AI-powered feedback
              </p>
              <Link href="/interview/new">
                <button className="px-6 py-3 bg-gradient-to-r from-sunset-rose to-sunset-coral text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          ) : showAll && groupedInterviews ? (
            // Grouped by day view
            <div className="space-y-6">
              {Object.entries(groupedInterviews).map(([day, dayInterviews]) => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-400">{day}</span>
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-xs text-gray-500">{dayInterviews.length} session{dayInterviews.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {dayInterviews.map((interview) => (
                      <InterviewCard 
                        key={interview.id} 
                        interview={interview} 
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onDelete={openDeleteModal}
                        compact
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Default list view (5 items)
            <div className="space-y-3">
              {displayedInterviews.map((interview) => (
                <InterviewCard 
                  key={interview.id} 
                  interview={interview} 
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.interview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 modal-backdrop animate-fade-in"
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="relative glass-dropdown max-w-md w-full p-6 animate-scale-in">
            {/* Close button */}
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 press-effect"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center animate-bounce-in">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Delete Session?
              </h3>
              <p className="text-gray-400 text-sm">
                Are you sure you want to delete this interview session? This action cannot be undone.
              </p>
              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <p className="text-white font-medium text-sm truncate">
                  {deleteModal.interview.roleDescription}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(deleteModal.interview.createdAt).toLocaleDateString()} • {deleteModal.interview.signalsDetected?.length || 0} signals
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: any
  label: string
  value: string
  iconColor: string
}) {
  return (
    <div className="glass-card-subtle p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-white/5`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
      </div>
    </div>
  )
}

function InterviewCard({ 
  interview, 
  openMenu, 
  setOpenMenu,
  onDelete,
  compact = false
}: { 
  interview: Interview
  openMenu: string | null
  setOpenMenu: (id: string | null) => void
  onDelete: (interview: Interview) => void
  compact?: boolean
}) {
  const personaEmojis: Record<string, string> = {
    technical: '💻',
    skeptic: '🤨',
    friendly: '😊',
    rushed: '⏱️',
  }

  const personaLabels: Record<string, string> = {
    technical: 'Technical',
    skeptic: 'Skeptical',
    friendly: 'Friendly',
    rushed: 'Rushed',
  }

  const avgScore = interview.signalsDetected?.reduce((sum: number, sig) => sum + sig.score, 0) / (interview.signalsDetected?.length || 1) || 0

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/10'
    if (score >= 6) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  const isMenuOpen = openMenu === interview.id

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className={`glass-card-subtle hover:border-white/20 transition-all duration-300 hover-lift overflow-visible ${compact ? 'p-4' : 'p-5'} ${isMenuOpen ? 'z-30 relative' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Persona emoji */}
        <span className="text-2xl flex-shrink-0">
          {personaEmojis[interview.persona] || '📋'}
        </span>

        {/* Content */}
        <Link href={`/interview/results/${interview.id}`} className="flex-1 min-w-0 group">
          <h3 className="font-medium text-white group-hover:text-sunset-rose transition-colors duration-200 truncate">
            {interview.roleDescription}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge text-xs">
              {personaLabels[interview.persona]}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(interview.createdAt)}
            </span>
            {!compact && interview.signalsDetected && interview.signalsDetected.length > 0 && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-500">
                  {interview.signalsDetected.length} signals
                </span>
              </>
            )}
          </div>
        </Link>

        {/* Score */}
        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getScoreColor(avgScore)} ${getScoreBg(avgScore)}`}>
          {avgScore.toFixed(1)}
        </div>
        
        {/* Menu */}
        <div className="relative">
          <button 
            onClick={() => setOpenMenu(isMenuOpen ? null : interview.id)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 hover:bg-gray-700 rounded-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setOpenMenu(null)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <Link 
                  href={`/interview/results/${interview.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700 transition-colors text-gray-300 text-sm"
                  onClick={() => setOpenMenu(null)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
                <button
                  onClick={() => onDelete(interview)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-900/20 transition-colors text-red-400 text-sm border-t border-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
