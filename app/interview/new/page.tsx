'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { searchRoles, detectRoleCategory } from '@/lib/job-roles'

const personas = [
  { 
    id: 'technical', 
    emoji: '💻', 
    label: 'Technical Expert', 
    description: 'Deep technical questions, expects specific details and trade-offs'
  },
  { 
    id: 'skeptic', 
    emoji: '🤨', 
    label: 'The Skeptic', 
    description: 'Challenges your answers, tests composure under pressure'
  },
  { 
    id: 'friendly', 
    emoji: '😊', 
    label: 'Friendly Coach', 
    description: 'Conversational, focuses on culture fit and collaboration'
  },
  { 
    id: 'rushed', 
    emoji: '⏱️', 
    label: 'Rushed Manager', 
    description: 'Fast-paced, tests your ability to be concise'
  },
]

export default function NewInterviewPage() {
  const router = useRouter()
  const [roleDescription, setRoleDescription] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1)

  // Smart search for role suggestions
  const handleRoleChange = (value: string) => {
    setRoleDescription(value)
    if (value.length >= 2) {
      const results = searchRoles(value, 8)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setFocusedSuggestion(-1)
  }

  const selectRole = (role: string) => {
    setRoleDescription(role)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedSuggestion(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && focusedSuggestion >= 0) {
      e.preventDefault()
      selectRole(suggestions[focusedSuggestion])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleStartInterview = async () => {
    if (!roleDescription.trim() || !selectedPersona) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleDescription: roleDescription.trim(),
          persona: selectedPersona,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store interview data in sessionStorage for the session page
        sessionStorage.setItem(`interview_${data.interviewId}`, JSON.stringify({
          id: data.interviewId,
          roleDescription: data.roleDescription,
          persona: data.persona,
          questions: data.questions,
          answers: {},
          startedAt: new Date().toISOString(),
        }))

        // Navigate to interview session
        router.push(`/interview/session/${data.interviewId}`)
      } else {
        console.error('Failed to start interview:', data.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      setIsLoading(false)
    }
  }

  const canStart = roleDescription.trim().length >= 3 && selectedPersona

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
            <Link href="/dashboard">
              <button className="btn-ghost !px-4 !py-2 text-sm press-effect">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <main id="main-content" className="max-w-3xl mx-auto px-6 lg:px-8 py-12 isolate">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Start Interview Practice
          </h1>
          <p className="text-xl text-gray-400">
            Choose your role and interviewer style to begin
          </p>
        </div>

        {/* Step 1: Role */}
        <div className="glass-card p-8 mb-8 relative z-30 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sunset-rose to-sunset-coral text-white font-bold text-lg shadow-lg shadow-sunset-coral/30">
              1
            </span>
            <h2 className="text-2xl font-display font-bold text-white">
              What role are you interviewing for?
            </h2>
          </div>

          <div className="relative">
            <input
              type="text"
              value={roleDescription}
              onChange={(e) => handleRoleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g., Product Manager, UX Designer, Software Engineer..."
              className="glass-input w-full px-5 py-4 text-white placeholder-gray-500 text-lg"
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-dropdown max-h-64 overflow-y-auto animate-slide-in-bottom" style={{ zIndex: 9999 }}>
                {suggestions.map((role, index) => (
                  <button
                    key={role}
                    onClick={() => selectRole(role)}
                    className={`w-full px-5 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                      focusedSuggestion === index ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {roleDescription.length >= 3 && (
            <p className="mt-3 text-sm text-sunset-coral flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Detected: {detectRoleCategory(roleDescription)} role
            </p>
          )}
        </div>

        {/* Step 2: Persona */}
        <div className={`glass-card p-8 mb-8 transition-all duration-500 ${
          showSuggestions 
            ? 'opacity-20 pointer-events-none blur-sm' 
            : roleDescription.trim().length >= 3 
              ? 'opacity-100 animate-fade-in-up' 
              : 'opacity-40 pointer-events-none'
        }`} style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 ${
              roleDescription.trim().length >= 3 
                ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30'
                : 'bg-white/10 text-gray-500'
            }`}>
              2
            </span>
            <h2 className="text-2xl font-display font-bold text-white">
              Choose your interviewer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`p-6 rounded-xl text-left transition-all duration-300 press-effect ${
                  selectedPersona === persona.id
                    ? 'card-selected'
                    : 'glass-card-subtle hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{persona.emoji}</span>
                  <span className="text-lg font-semibold text-white">{persona.label}</span>
                </div>
                <p className="text-gray-400 text-sm">{persona.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={handleStartInterview}
            disabled={!canStart || isLoading}
            className={`btn-primary inline-flex items-center gap-3 !px-10 !py-5 !rounded-2xl text-lg ${
              !canStart || isLoading ? '!opacity-50 !cursor-not-allowed !transform-none !shadow-none' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start Interview (5 Questions)
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!canStart && (
            <p className="mt-4 text-gray-500 text-sm">
              {!roleDescription.trim() 
                ? '☝️ Enter your target role above'
                : !selectedPersona 
                  ? '☝️ Select an interviewer style'
                  : ''
              }
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
