"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, RefreshCw, Sparkle } from "lucide-react"
import { commonRoles, roleSpecificQuestions, detectRoleCategory } from "@/lib/job-roles"

const personas = [
  { 
    value: "technical", 
    label: "Technical Expert", 
    description: "Deep technical questions, expects specific details and trade-offs",
    icon: "💻"
  },
  { 
    value: "skeptic", 
    label: "The Skeptic", 
    description: "Challenges your answers, tests composure under pressure",
    icon: "🤨"
  },
  { 
    value: "friendly", 
    label: "Friendly Coach", 
    description: "Conversational, focuses on culture fit and collaboration",
    icon: "😊"
  },
  { 
    value: "rushed", 
    label: "Rushed Manager", 
    description: "Fast-paced, tests your ability to be concise",
    icon: "⏱️"
  },
]

const defaultQuestions = {
  technical: [
    "Explain how you would design a rate limiter for an API",
    "How would you optimize a slow database query?",
    "Describe your approach to debugging a production issue",
  ],
  behavioral: [
    "Tell me about a time you disagreed with a team member",
    "Describe a project where you had to learn a new technology quickly",
    "How do you prioritize competing deadlines?",
  ],
  system_design: [
    "Design a URL shortener like bit.ly",
    "How would you design Instagram's feed?",
    "Design a distributed cache system",
  ],
  leadership: [
    "How do you handle underperforming team members?",
    "Describe your approach to mentoring junior developers",
    "Tell me about a time you had to make an unpopular decision",
  ],
  product: [
    "How would you improve our product's user onboarding?",
    "Walk me through how you'd prioritize features for a new release",
    "How do you balance technical debt with new features?",
  ],
  problem_solving: [
    "How would you debug a memory leak in production?",
    "Tell me about the most complex problem you've solved",
    "How do you approach learning a completely new technology stack?",
  ],
}

type QuestionType = keyof typeof defaultQuestions

// Map roles to recommended question categories
function getRecommendedCategories(role: string): QuestionType[] {
  const roleLower = role.toLowerCase()
  
  // Product roles (check before leadership to avoid "manager" match)
  if (roleLower.includes('product manager') || roleLower.includes('product engineer') || 
      roleLower.includes('product owner') || roleLower.includes('growth')) {
    return ['product', 'behavioral', 'problem_solving']
  }
  
  // Sales & Business Development
  if (roleLower.includes('sales') || roleLower.includes('account executive') || 
      roleLower.includes('business development') || roleLower.includes('bdr') || 
      roleLower.includes('account manager')) {
    return ['behavioral', 'problem_solving', 'leadership']
  }
  
  // Marketing
  if (roleLower.includes('marketing') || roleLower.includes('seo') || 
      roleLower.includes('content') || roleLower.includes('brand') || 
      roleLower.includes('social media')) {
    return ['behavioral', 'product', 'problem_solving']
  }
  
  // Finance & Accounting
  if (roleLower.includes('finance') || roleLower.includes('accounting') || 
      roleLower.includes('accountant') || roleLower.includes('financial') || 
      roleLower.includes('controller') || roleLower.includes('cfo')) {
    return ['problem_solving', 'behavioral', 'leadership']
  }
  
  // Human Resources
  if (roleLower.includes('hr ') || roleLower.includes('human resource') || 
      roleLower.includes('recruiter') || roleLower.includes('talent') || 
      roleLower.includes('people operations')) {
    return ['behavioral', 'leadership', 'problem_solving']
  }
  
  // Operations & Supply Chain
  if (roleLower.includes('operations') || roleLower.includes('supply chain') || 
      roleLower.includes('logistics') || roleLower.includes('procurement') || 
      roleLower.includes('warehouse') || roleLower.includes('coo')) {
    return ['problem_solving', 'leadership', 'behavioral']
  }
  
  // Customer Service & Support
  if (roleLower.includes('customer service') || roleLower.includes('customer support') || 
      roleLower.includes('customer success') || roleLower.includes('support specialist')) {
    return ['behavioral', 'problem_solving', 'leadership']
  }
  
  // Healthcare
  if (roleLower.includes('nurse') || roleLower.includes('doctor') || 
      roleLower.includes('physician') || roleLower.includes('medical') || 
      roleLower.includes('healthcare') || roleLower.includes('clinical')) {
    return ['behavioral', 'problem_solving', 'leadership']
  }
  
  // Education
  if (roleLower.includes('teacher') || roleLower.includes('professor') || 
      roleLower.includes('instructor') || roleLower.includes('education') || 
      roleLower.includes('academic')) {
    return ['behavioral', 'problem_solving', 'leadership']
  }
  
  // Legal
  if (roleLower.includes('attorney') || roleLower.includes('lawyer') || 
      roleLower.includes('legal') || roleLower.includes('counsel') || 
      roleLower.includes('paralegal')) {
    return ['problem_solving', 'behavioral', 'leadership']
  }
  
  // Creative & Design (Non-Tech)
  if (roleLower.includes('graphic designer') || roleLower.includes('art director') || 
      roleLower.includes('copywriter') || roleLower.includes('creative director') || 
      roleLower.includes('illustrator') || roleLower.includes('photographer')) {
    return ['behavioral', 'problem_solving', 'product']
  }
  
  // Hospitality
  if (roleLower.includes('hotel') || roleLower.includes('restaurant') || 
      roleLower.includes('hospitality') || roleLower.includes('chef') || 
      roleLower.includes('catering')) {
    return ['behavioral', 'leadership', 'problem_solving']
  }
  
  // Retail
  if (roleLower.includes('retail') || roleLower.includes('store manager') || 
      roleLower.includes('merchandise')) {
    return ['behavioral', 'leadership', 'problem_solving']
  }
  
  // Leadership roles (check after specific roles to avoid early matching)
  if (roleLower.includes('manager') || roleLower.includes('director') || 
      roleLower.includes('vp') || roleLower.includes('cto') || roleLower.includes('ceo') || 
      roleLower.includes('head of') || roleLower.includes('lead')) {
    return ['leadership', 'behavioral', 'system_design']
  }
  
  // ===== TECH ROLES =====
  
  // Data & ML roles
  if (roleLower.includes('data') || roleLower.includes('ml') || 
      roleLower.includes('machine learning') || roleLower.includes('ai')) {
    return ['technical', 'problem_solving', 'system_design']
  }
  
  // Frontend roles
  if (roleLower.includes('frontend') || roleLower.includes('react') || 
      roleLower.includes('vue') || roleLower.includes('angular') || 
      roleLower.includes('ui engineer')) {
    return ['technical', 'problem_solving', 'behavioral']
  }
  
  // Backend roles
  if (roleLower.includes('backend') || roleLower.includes('api') || 
      roleLower.includes('node') || roleLower.includes('python') || 
      roleLower.includes('java') || roleLower.includes('go')) {
    return ['technical', 'system_design', 'problem_solving']
  }
  
  // Full Stack
  if (roleLower.includes('full stack') || roleLower.includes('fullstack')) {
    return ['technical', 'system_design', 'behavioral']
  }
  
  // Mobile
  if (roleLower.includes('mobile') || roleLower.includes('ios') || 
      roleLower.includes('android') || roleLower.includes('react native') || 
      roleLower.includes('flutter')) {
    return ['technical', 'problem_solving', 'behavioral']
  }
  
  // DevOps/SRE/Infrastructure
  if (roleLower.includes('devops') || roleLower.includes('sre') || 
      roleLower.includes('infrastructure') || roleLower.includes('cloud') || 
      roleLower.includes('platform')) {
    return ['system_design', 'technical', 'problem_solving']
  }
  
  // Security
  if (roleLower.includes('security') || roleLower.includes('cybersecurity')) {
    return ['technical', 'problem_solving', 'system_design']
  }
  
  // QA/Testing
  if (roleLower.includes('qa') || roleLower.includes('test') || 
      roleLower.includes('sdet') || roleLower.includes('quality')) {
    return ['technical', 'problem_solving', 'behavioral']
  }
  
  // Design/UX (Tech)
  if (roleLower.includes('design') || roleLower.includes('ux')) {
    return ['behavioral', 'problem_solving', 'product']
  }
  
  // Staff/Principal/Senior IC roles
  if (roleLower.includes('staff') || roleLower.includes('principal') || 
      roleLower.includes('distinguished')) {
    return ['system_design', 'leadership', 'technical']
  }
  
  // Default for any role
  return ['behavioral', 'problem_solving', 'leadership']
}

export function InterviewSetupForm({ onStepChange }: { onStepChange?: (steps: { role: boolean; persona: boolean; question: boolean }) => void }) {
  const router = useRouter()
  const [roleDescription, setRoleDescription] = useState("")
  const [persona, setPersona] = useState("")
  const [questionType, setQuestionType] = useState<QuestionType>("technical")
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const [filteredRoles, setFilteredRoles] = useState<string[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendedCategories, setRecommendedCategories] = useState<QuestionType[]>([])
  const autocompleteRef = useRef<HTMLDivElement>(null)

  // Notify parent about step completion
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        role: roleDescription.trim().length > 0,
        persona: persona.length > 0,
        question: question.trim().length > 0,
      })
    }
  }, [roleDescription, persona, question, onStepChange])

  // Initialize questions
  useEffect(() => {
    setDisplayedQuestions(defaultQuestions[questionType])
  }, [questionType])

  // Handle role description changes
  useEffect(() => {
    const input = roleDescription.trim()
    
    if (input.length > 0) {
      const matches = commonRoles.filter(role => 
        role.toLowerCase().includes(input.toLowerCase())
      )
      setFilteredRoles(matches.slice(0, 10))
      setShowRoleSuggestions(matches.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setFilteredRoles([])
      setShowRoleSuggestions(false)
    }
  }, [roleDescription])

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowRoleSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showRoleSuggestions || filteredRoles.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < filteredRoles.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault()
          selectRole(filteredRoles[selectedSuggestionIndex])
        }
        break
      case "Escape":
        setShowRoleSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  const selectRole = (role: string) => {
    setRoleDescription(role)
    setShowRoleSuggestions(false)
    setSelectedSuggestionIndex(-1)
    
    // Get recommended categories for this role
    const recommended = getRecommendedCategories(role)
    setRecommendedCategories(recommended)
    
    // Auto-select the first recommended category
    if (recommended.length > 0 && recommended[0] !== questionType) {
      setQuestionType(recommended[0])
    }
    
    // Auto-generate role-specific questions
    generateRoleSpecificQuestions(role)
  }

  const generateRoleSpecificQuestions = (role: string) => {
    const category = detectRoleCategory(role)
    const questions = roleSpecificQuestions[category]
    
    if (questions && questions.length > 0) {
      // Shuffle and pick 3 random questions
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setDisplayedQuestions(shuffled.slice(0, 3))
    }
  }

  const generateMoreQuestions = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      if (roleDescription.trim()) {
        const category = detectRoleCategory(roleDescription)
        const allQuestions = roleSpecificQuestions[category] || defaultQuestions[questionType]
        
        // Get 3 new random questions that aren't currently displayed
        const availableQuestions = allQuestions.filter(q => !displayedQuestions.includes(q))
        
        if (availableQuestions.length > 0) {
          const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
          setDisplayedQuestions(shuffled.slice(0, 3))
        } else {
          // If no more unique questions, reshuffle all
          const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
          setDisplayedQuestions(shuffled.slice(0, 3))
        }
      } else {
        // No role selected, use default questions
        const allQuestions = defaultQuestions[questionType]
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
        setDisplayedQuestions(shuffled.slice(0, 3))
      }
      
      setIsGenerating(false)
    }, 800)
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="font-semibold text-sunset-rose">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleDescription,
          persona,
          question,
          questionType,
        }),
      })

      if (!response.ok) throw new Error("Failed to create interview")

      const interview = await response.json()
      router.push(`/interview/${interview.id}`)
    } catch (error) {
      console.error("Error creating interview:", error)
      alert("Failed to create interview. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Role with Smart Autocomplete */}
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700 shadow-lg relative z-30">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-sunset-rose/10 text-sunset-rose rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-sunset-rose/30">
            🎯
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-white mb-2">What role are you targeting?</h2>
            <p className="text-base text-gray-400 mb-4">Start typing to see smart suggestions from real job markets</p>
            
            <div className="relative z-50" ref={autocompleteRef}>
              <input
                type="text"
                placeholder="e.g., Senior React Engineer at Series B startup"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                onKeyDown={handleRoleKeyDown}
                onFocus={() => {
                  if (filteredRoles.length > 0) {
                    setShowRoleSuggestions(true)
                  }
                }}
                className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sunset-rose focus:border-transparent transition-all text-base placeholder-gray-500"
                required
                autoComplete="off"
              />
              
              {/* Autocomplete Dropdown */}
              {showRoleSuggestions && filteredRoles.length > 0 && (
                <div className="absolute z-[9999] w-full mt-2 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 mb-2">
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-sunset-coral" />
                        Smart suggestions from real roles
                      </p>
                      <span className="text-xs text-gray-500">{filteredRoles.length} matches</span>
                    </div>
                    {filteredRoles.map((role, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectRole(role)}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-150 ${
                          selectedSuggestionIndex === index
                            ? "bg-sunset-rose/10 text-white border-2 border-sunset-rose/50"
                            : "text-gray-300 hover:bg-gray-700 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">💼</span>
                          <span className="flex-1 leading-relaxed">
                            {highlightMatch(role, roleDescription)}
                          </span>
                        </div>
                      </button>
                    ))}
                    <div className="px-3 py-2 mt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span>💡</span>
                        Use ↑↓ to navigate, Enter to select, Esc to close
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!roleDescription && (
              <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sunset-coral" />
                Start typing to see intelligent role suggestions
              </p>
            )}
            
            {roleDescription && !showRoleSuggestions && (
              <p className="mt-3 text-sm text-green-400 flex items-center gap-2">
                <span>✓</span>
                Questions will be tailored to this role
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Persona */}
      <div className={`bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 shadow-lg relative z-20 transition-all duration-300 ${
        roleDescription.trim().length > 0 
          ? 'border-gray-700 opacity-100' 
          : 'border-gray-800 opacity-50 pointer-events-none'
      }`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-sunset-coral/10 text-sunset-coral rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-sunset-coral/30">
            🎭
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
              Choose interviewer persona
              {roleDescription.trim().length === 0 && (
                <span className="text-xs font-normal text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">
                  🔒 Complete step 1 first
                </span>
              )}
            </h2>
            <p className="text-base text-gray-400 mb-6">Different personas test different skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPersona(p.value)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                persona === p.value
                  ? "border-sunset-rose bg-sunset-rose/10"
                  : "border-gray-700 bg-gray-900/50 hover:border-sunset-rose/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{p.icon}</span>
                <h3 className="font-display font-semibold text-white text-lg">{p.label}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Question with Generate Button */}
      <div className={`bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 shadow-lg relative z-10 transition-all duration-300 ${
        persona.length > 0
          ? 'border-gray-700 opacity-100'
          : 'border-gray-800 opacity-50 pointer-events-none'
      }`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-sunset-plum/10 text-sunset-plum rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-sunset-plum/30">
            ❓
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
              Select your question
              {persona.length === 0 && (
                <span className="text-xs font-normal text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">
                  🔒 Complete step 2 first
                </span>
              )}
            </h2>
            <p className="text-base text-gray-400 mb-6">
              {roleDescription ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sunset-coral" />
                  Questions tailored for your role
                </span>
              ) : (
                "Choose a sample question or write your own"
              )}
            </p>
          </div>
        </div>

        {/* Question Type Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: "technical" as QuestionType, label: "Technical", icon: "💻" },
            { key: "behavioral" as QuestionType, label: "Behavioral", icon: "💬" },
            { key: "system_design" as QuestionType, label: "System Design", icon: "🏗️" },
            { key: "leadership" as QuestionType, label: "Leadership", icon: "👥" },
            { key: "product" as QuestionType, label: "Product", icon: "📱" },
            { key: "problem_solving" as QuestionType, label: "Problem Solving", icon: "🧩" },
          ].map((type) => {
            const isRecommended = recommendedCategories.includes(type.key)
            const isSelected = questionType === type.key
            
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => {
                  setQuestionType(type.key)
                  setQuestion("")
                }}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-200 text-base flex items-center gap-2 ${
                  isSelected
                    ? "bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg"
                    : isRecommended
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 ring-2 ring-sunset-rose/50"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
                {isRecommended && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-sunset-coral rounded-full animate-pulse" title="Recommended for your role"></span>
                )}
              </button>
            )
          })}
        </div>

        {/* Sample Questions with Generate Button */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-base font-semibold text-gray-300">
              {roleDescription ? "Role-specific questions:" : "Sample questions:"}
            </label>
            <button
              type="button"
              onClick={generateMoreQuestions}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-sunset-rose/10 hover:bg-sunset-rose/20 text-sunset-rose border-2 border-sunset-rose/30 rounded-full transition-all font-semibold text-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkle className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4" />
                  New Questions
                </>
              )}
            </button>
          </div>
          
          {displayedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuestion(q)}
              className={`block w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                question === q
                  ? "border-sunset-rose bg-sunset-rose/10"
                  : "border-gray-700 bg-gray-900/50 hover:border-sunset-rose/50"
              }`}
            >
              <p className="text-base text-white leading-relaxed">{q}</p>
            </button>
          ))}
        </div>

        {/* Custom Question */}
        <div>
          <label className="block text-base font-semibold text-gray-300 mb-3">Or write your own:</label>
          <textarea
            placeholder="Enter your interview question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sunset-rose focus:border-transparent transition-all resize-none text-base placeholder-gray-500"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !roleDescription || !persona || !question}
        className="btn-sunset w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Creating Interview...
          </span>
        ) : (
          "Continue to Recording →"
        )}
      </button>
    </form>
  )
}
