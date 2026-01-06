'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Check } from 'lucide-react'
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

// All available focus categories
const allFocusCategories = [
  {
    id: 'technical',
    emoji: '🔧',
    label: 'Technical',
    description: 'Role-specific technical questions and deep dives',
    relevantFor: ['frontend', 'backend', 'fullstack', 'mobile', 'data', 'ml', 'devops', 'security', 'finance', 'healthcare', 'legal'],
  },
  {
    id: 'behavioral',
    emoji: '💬',
    label: 'Behavioral',
    description: 'Past experiences, STAR-format questions about real situations',
    relevantFor: 'all',
  },
  {
    id: 'leadership',
    emoji: '👥',
    label: 'Leadership',
    description: 'Team management, decision-making, and influence',
    relevantFor: ['leadership', 'product', 'operations', 'hr', 'consulting', 'education'],
  },
  {
    id: 'problem_solving',
    emoji: '🧩',
    label: 'Problem Solving',
    description: 'Analytical thinking, structured problem-solving approaches',
    relevantFor: ['frontend', 'backend', 'fullstack', 'mobile', 'data', 'ml', 'devops', 'security', 'consulting', 'finance', 'product'],
  },
  {
    id: 'soft_skills',
    emoji: '🤝',
    label: 'Soft Skills',
    description: 'Communication, collaboration, conflict resolution',
    relevantFor: 'all',
  },
  {
    id: 'culture_fit',
    emoji: '🏢',
    label: 'Culture Fit',
    description: 'Values alignment, work style, and team dynamics',
    relevantFor: 'all',
  },
  {
    id: 'situational',
    emoji: '🎯',
    label: 'Situational',
    description: 'Hypothetical scenarios specific to your role',
    relevantFor: ['sales', 'marketing', 'customerservice', 'hospitality', 'retail', 'healthcare', 'education'],
  },
  {
    id: 'mixed',
    emoji: '🎲',
    label: 'Comprehensive Mix',
    description: 'A balanced combination of all question types',
    relevantFor: 'all',
  },
]

export default function NewInterviewPage() {
  const router = useRouter()
  const [roleDescription, setRoleDescription] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1)

  // Detect role category for smart category suggestions
  const detectedRoleCategory = useMemo(() => {
    if (roleDescription.trim().length < 3) return null
    return detectRoleCategory(roleDescription)
  }, [roleDescription])

  // Filter and sort categories based on role relevance
  const relevantCategories = useMemo(() => {
    if (!detectedRoleCategory) return allFocusCategories

    return [...allFocusCategories].sort((a, b) => {
      const aRelevant = a.relevantFor === 'all' || (Array.isArray(a.relevantFor) && a.relevantFor.includes(detectedRoleCategory))
      const bRelevant = b.relevantFor === 'all' || (Array.isArray(b.relevantFor) && b.relevantFor.includes(detectedRoleCategory))
      
      // Prioritize relevant categories
      if (aRelevant && !bRelevant) return -1
      if (!aRelevant && bRelevant) return 1
      
      // Among relevant, prioritize 'mixed' last
      if (a.id === 'mixed') return 1
      if (b.id === 'mixed') return -1
      
      return 0
    })
  }, [detectedRoleCategory])

  // Calculate current step
  const currentStep = useMemo(() => {
    if (!roleDescription.trim() || roleDescription.trim().length < 3) return 1
    if (!selectedPersona) return 2
    return 3
  }, [roleDescription, selectedPersona])

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
    if (!roleDescription.trim() || !selectedPersona || !selectedCategory) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleDescription: roleDescription.trim(),
          persona: selectedPersona,
          focusCategory: selectedCategory,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store interview data in sessionStorage for the session page
        sessionStorage.setItem(`interview_${data.interviewId}`, JSON.stringify({
          id: data.interviewId,
          roleDescription: data.roleDescription,
          persona: data.persona,
          focusCategory: selectedCategory,
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

  const canStart = roleDescription.trim().length >= 3 && selectedPersona && selectedCategory

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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Start Interview Practice
          </h1>
          <p className="text-xl text-gray-400">
            Customize your mock interview experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
          {[
            { num: 1, label: 'Role' },
            { num: 2, label: 'Interviewer' },
            { num: 3, label: 'Focus' },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300
                  ${currentStep > step.num 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.num 
                      ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30' 
                      : 'bg-white/10 text-gray-500'
                  }
                `}>
                  {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  currentStep >= step.num ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`w-12 md:w-20 h-0.5 rounded-full transition-colors duration-300 ${
                  currentStep > step.num ? 'bg-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Role */}
        <div className="glass-card p-8 mb-6 relative z-30 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 ${
              currentStep > 1 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
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
              Detected: {detectedRoleCategory} role
            </p>
          )}
        </div>

        {/* Step 2: Persona */}
        <div className={`glass-card p-8 mb-6 transition-all duration-500 ${
          showSuggestions 
            ? 'opacity-20 pointer-events-none blur-sm' 
            : currentStep >= 2
              ? 'opacity-100 animate-fade-in-up' 
              : 'opacity-40 pointer-events-none'
        }`} style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 ${
              currentStep > 2 
                ? 'bg-green-500 text-white' 
                : currentStep === 2 
                  ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30'
                  : 'bg-white/10 text-gray-500'
            }`}>
              {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
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
                className={`p-5 rounded-xl text-left transition-all duration-300 press-effect ${
                  selectedPersona === persona.id
                    ? 'card-selected'
                    : 'glass-card-subtle hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{persona.emoji}</span>
                  <span className="text-lg font-semibold text-white">{persona.label}</span>
                </div>
                <p className="text-gray-400 text-sm">{persona.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Focus Category */}
        <div className={`glass-card p-8 mb-8 transition-all duration-500 ${
          showSuggestions 
            ? 'opacity-20 pointer-events-none blur-sm' 
            : currentStep >= 3
              ? 'opacity-100 animate-fade-in-up' 
              : 'opacity-40 pointer-events-none'
        }`} style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 ${
              selectedCategory 
                ? 'bg-green-500 text-white' 
                : currentStep === 3 
                  ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30'
                  : 'bg-white/10 text-gray-500'
            }`}>
              {selectedCategory ? <Check className="w-5 h-5" /> : '3'}
            </span>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                Select interview focus
              </h2>
              {detectedRoleCategory && (
                <p className="text-sm text-gray-400 mt-1">
                  Categories optimized for <span className="text-sunset-coral">{detectedRoleCategory}</span> roles
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
            {relevantCategories.map((category) => {
              const isRelevant = category.relevantFor === 'all' || 
                (Array.isArray(category.relevantFor) && detectedRoleCategory && category.relevantFor.includes(detectedRoleCategory))
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 press-effect ${
                    selectedCategory === category.id
                      ? 'card-selected'
                      : 'glass-card-subtle hover:border-white/20'
                  } ${!isRelevant && detectedRoleCategory ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xl">{category.emoji}</span>
                    <span className="text-base font-semibold text-white">{category.label}</span>
                    {isRelevant && detectedRoleCategory && category.relevantFor !== 'all' && (
                      <span className="ml-auto text-xs bg-sunset-coral/20 text-sunset-coral px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm pl-9">{category.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
              {!roleDescription.trim() || roleDescription.trim().length < 3
                ? '☝️ Enter your target role above'
                : !selectedPersona 
                  ? '☝️ Select an interviewer style'
                  : !selectedCategory
                    ? '☝️ Choose your interview focus'
                    : ''
              }
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
