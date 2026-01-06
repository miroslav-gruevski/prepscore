'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircle, ChevronDown, ChevronUp, 
  TrendingUp, TrendingDown, Minus, Award,
  MessageSquare, Brain, Users, Target, Zap,
  RefreshCw, Share2, Download, ArrowLeft
} from 'lucide-react'
import { getQuestionTypeDisplay, getPersonaDisplay } from '@/lib/question-generator'

interface Question {
  questionNumber: number
  questionType: string
  questionText: string
}

interface QuestionFeedback {
  questionNumber: number
  questionType: string
  questionText: string
  score: number
  strengths: string[]
  improvements: string[]
  keyTakeaway: string
  transcript?: string // Transcribed response from the user
}

interface SkillScore {
  name: string
  score: number
  emoji: string
  description: string
  trend: 'up' | 'down' | 'neutral'
}

// Focus category display info
const focusCategoryInfo: Record<string, { emoji: string; label: string }> = {
  technical: { emoji: '🔧', label: 'Technical' },
  behavioral: { emoji: '💬', label: 'Behavioral' },
  leadership: { emoji: '👥', label: 'Leadership' },
  problem_solving: { emoji: '🧩', label: 'Problem Solving' },
  soft_skills: { emoji: '🤝', label: 'Soft Skills' },
  culture_fit: { emoji: '🏢', label: 'Culture Fit' },
  situational: { emoji: '🎯', label: 'Situational' },
  mixed: { emoji: '🎲', label: 'Mixed' },
}

interface AnalysisData {
  overallScore: number
  verdict: string
  overallFeedback: string
  skills: SkillScore[]
  topStrengths: string[]
  topImprovements: string[]
  actionItems: string[]
  questionFeedback: QuestionFeedback[]
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [interview, setInterview] = useState<any>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set([1]))
  const [selectedAmount, setSelectedAmount] = useState(5)

  useEffect(() => {
    async function loadInterviewData() {
      const isDemoId = id.startsWith('demo_') || id.startsWith('demo-')
      
      // For real interview IDs, fetch from API
      if (!isDemoId) {
        try {
          const response = await fetch(`/api/interviews/${id}/results`)
          if (response.ok) {
            const data = await response.json()
            if (data.interview) {
              const dbInterview = data.interview
              setInterview({
                id: dbInterview.id,
                roleDescription: dbInterview.roleDescription,
                persona: dbInterview.persona,
                focusCategory: dbInterview.questions[0]?.questionType || 'mixed',
                questions: dbInterview.questions,
              })
              
              // Use real analysis if available
              if (dbInterview.analysis) {
                setAnalysis({
                  overallScore: dbInterview.analysis.overallScore,
                  verdict: dbInterview.analysis.verdict,
                  overallFeedback: dbInterview.analysis.overallFeedback,
                  skills: [
                    { name: 'Communication', score: dbInterview.analysis.skills?.communicationClarity || 7, emoji: '💬', description: 'Clear explanations', trend: 'neutral' as const },
                    { name: 'Technical Depth', score: dbInterview.analysis.skills?.technicalDepth || 7, emoji: '🧠', description: 'Deep understanding', trend: 'up' as const },
                    { name: 'Problem Solving', score: dbInterview.analysis.skills?.problemFraming || 7, emoji: '🎯', description: 'Analytical approach', trend: 'neutral' as const },
                    { name: 'Leadership', score: dbInterview.analysis.skills?.leadership || 7, emoji: '👥', description: 'Team guidance', trend: 'up' as const },
                    { name: 'Structure', score: dbInterview.analysis.skills?.structure || 7, emoji: '📋', description: 'Organized responses', trend: 'neutral' as const },
                  ],
                  topStrengths: dbInterview.analysis.topStrengths || [],
                  topImprovements: dbInterview.analysis.topImprovements || [],
                  actionItems: dbInterview.analysis.actionItems || [],
                  questionFeedback: dbInterview.questions.map((q: any) => ({
                    questionNumber: q.questionNumber,
                    questionType: q.questionType,
                    questionText: q.questionText,
                    score: q.score || 0,
                    strengths: q.strengths || [],
                    improvements: q.improvements || [],
                    keyTakeaway: q.keyTakeaway || '',
                    transcript: q.transcript || undefined,
                  })),
                })
              } else {
                // No analysis yet - show pending state with real questions
                setAnalysis({
                  overallScore: 0,
                  verdict: 'Pending Analysis',
                  overallFeedback: 'Your interview responses are being analyzed. This may take a moment.',
                  skills: [],
                  topStrengths: [],
                  topImprovements: [],
                  actionItems: [],
                  questionFeedback: dbInterview.questions.map((q: any) => ({
                    questionNumber: q.questionNumber,
                    questionType: q.questionType,
                    questionText: q.questionText,
                    score: q.score || 0,
                    strengths: [],
                    improvements: [],
                    keyTakeaway: q.transcript ? 'Response recorded - analysis pending' : 'No response recorded',
                    transcript: q.transcript || undefined,
                  })),
                })
              }
              return
            }
          } else if (response.status === 404) {
            // Interview not found - redirect to dashboard
            window.location.href = '/dashboard'
            return
          }
        } catch (error) {
          console.error('Error fetching interview from API:', error)
        }
        
        // Check sessionStorage for in-progress interview (not yet saved to DB)
        const storedInterview = sessionStorage.getItem(`interview_${id}`)
        if (storedInterview) {
          const parsed = JSON.parse(storedInterview)
          setInterview(parsed)
          // Show pending analysis for real interviews without DB data
          setAnalysis({
            overallScore: 0,
            verdict: 'Pending Analysis',
            overallFeedback: 'Complete your interview session to receive AI-powered feedback.',
            skills: [],
            topStrengths: [],
            topImprovements: [],
            actionItems: [],
            questionFeedback: (parsed.questions || []).map((q: any) => ({
              questionNumber: q.questionNumber,
              questionType: q.questionType,
              questionText: q.questionText,
              score: 0,
              strengths: [],
              improvements: [],
              keyTakeaway: 'Complete this question to get feedback',
              transcript: undefined,
            })),
          })
          return
        }
        
        // Real ID but no data found - redirect to dashboard
        window.location.href = '/dashboard'
        return
      }
      
      // Demo mode: show sample data
      const storedInterview = sessionStorage.getItem(`interview_${id}`)
      
      if (storedInterview) {
        const parsed = JSON.parse(storedInterview)
        setInterview(parsed)
        const demoAnalysis = generateDemoAnalysis(parsed)
        setAnalysis(demoAnalysis)
      } else {
        // Fallback demo data for demo IDs only
        const demoInterview = {
          id,
          roleDescription: "Senior React Engineer",
          persona: "technical",
          focusCategory: "technical",
          questions: [
            { questionNumber: 1, questionType: 'technical', questionText: 'Explain the React reconciliation algorithm and how the virtual DOM diffing works.' },
            { questionNumber: 2, questionType: 'technical', questionText: 'How would you optimize the performance of a React application with slow renders?' },
            { questionNumber: 3, questionType: 'system_design', questionText: 'Design a real-time notification system that can handle millions of users.' },
            { questionNumber: 4, questionType: 'behavioral', questionText: 'Tell me about a time you had to resolve a conflict within your team.' },
            { questionNumber: 5, questionType: 'leadership', questionText: 'How do you approach mentoring junior developers on your team?' },
          ],
        }
        setInterview(demoInterview)
        setAnalysis(generateDemoAnalysis(demoInterview))
      }
    }
    
    loadInterviewData()
  }, [id])

  // Generate demo analysis (in production, this comes from AI)
  function generateDemoAnalysis(interviewData: any): AnalysisData {
    const questions = interviewData?.questions || []
    
    return {
      overallScore: 7.4,
      verdict: "Lean Hire",
      overallFeedback: "Strong technical foundation with good problem-solving skills. Communication could be more concise, and behavioral answers would benefit from the STAR method. Overall, a solid candidate who would likely succeed in the role with some coaching.",
      skills: [
        { name: 'Technical Depth', score: 9, emoji: '💻', description: 'Deep understanding of core concepts', trend: 'up' },
        { name: 'Problem Framing', score: 8, emoji: '🎯', description: 'Clarifies requirements effectively', trend: 'up' },
        { name: 'System Design', score: 7, emoji: '🏗️', description: 'Good high-level thinking', trend: 'neutral' },
        { name: 'Communication', score: 5, emoji: '💬', description: 'Could be more concise', trend: 'down' },
        { name: 'Conciseness', score: 4, emoji: '⚡', description: 'Answers are too long', trend: 'down' },
        { name: 'Structure (STAR)', score: 6, emoji: '📋', description: 'Behavioral answers need structure', trend: 'neutral' },
        { name: 'Confidence', score: 8, emoji: '💪', description: 'Speaks with conviction', trend: 'up' },
        { name: 'Leadership', score: 7, emoji: '👥', description: 'Shows mentorship qualities', trend: 'neutral' },
      ],
      topStrengths: [
        "Deep understanding of React internals and performance optimization",
        "Strong problem decomposition - breaks down complex problems effectively",
        "Good real-world examples from production experience",
        "Shows genuine passion for mentoring and team growth",
      ],
      topImprovements: [
        "Answers are 2x longer than ideal - practice being more concise",
        "Use the STAR method for behavioral questions (Situation, Task, Action, Result)",
        "Add specific metrics to strengthen your examples (%, time saved, users impacted)",
        "Reduce filler words ('um', 'like') - counted 23 instances",
      ],
      actionItems: [
        "Practice 2-minute answers with a timer",
        "Prepare 5 STAR-formatted stories before your next interview",
        "Record yourself and count filler words",
        "Add quantifiable metrics to your top 3 projects",
      ],
      questionFeedback: questions.map((q: Question, idx: number) => ({
        questionNumber: q.questionNumber,
        questionType: q.questionType,
        questionText: q.questionText,
        score: [8, 9, 7, 5, 7][idx] || 7,
        strengths: [
          "Clear explanation of core concepts",
          "Good use of analogies",
        ],
        improvements: [
          "Could add more specific examples",
          "Consider edge cases",
        ],
        keyTakeaway: [
          "Solid technical knowledge demonstrated",
          "Excellent comparison of approaches",
          "Good architecture thinking, add more details on trade-offs",
          "Use STAR method - answer was too vague",
          "Good mentorship examples, add specific growth outcomes",
        ][idx] || "Good answer overall",
        transcript: getDemoTranscript(idx),
      })),
    }
  }

  // Demo transcripts for testing (in production, these come from Deepgram)
  function getDemoTranscript(questionIndex: number): string {
    const transcripts = [
      "So for this question, I would approach it by first understanding the core requirements and constraints. In my previous role at a Series B startup, I led a similar initiative where we had to balance performance with maintainability. We started by conducting a thorough analysis of the existing system, identified the key bottlenecks using profiling tools, and then implemented a phased rollout strategy. The key was constant communication with stakeholders and iterative improvements based on real user feedback. We ended up reducing our bundle size by about 40% and improving Time to Interactive by 2 seconds.",
      "That's a great question. When I think about system design at scale, I always start with the fundamentals: what are the access patterns, what's the expected load, and what are the consistency requirements? For this particular scenario, I would recommend a microservices architecture with event-driven communication. We'd use something like Kafka or RabbitMQ for decoupling, implement caching at multiple levels with Redis, and ensure we have proper monitoring and alerting in place. I've done this before at my current company where we handle about 10 million daily active users.",
      "In my experience, the most effective way to handle this situation is through clear communication and empathy. I remember a time when I had to navigate a disagreement between two senior team members about the technical direction of a project. I scheduled individual one-on-ones first to understand each perspective fully, then facilitated a collaborative session where we could align on shared goals. By focusing on the user outcomes rather than technical preferences, we reached a consensus. The outcome was actually better than either initial proposal and both engineers felt heard.",
      "I'm really passionate about mentoring because I believe it creates a multiplier effect for the entire team. My approach involves setting up regular one-on-ones, creating stretch assignments that push people slightly outside their comfort zone, and always providing context for the 'why' behind decisions. I've seen three junior developers grow into mid-level engineers and one into a technical lead using this method. I also encourage them to present at team meetings and take ownership of small features end-to-end.",
      "When it comes to this type of challenge, I take a data-driven approach. First, I establish baseline metrics and identify the critical path. Then I use profiling tools to pinpoint the actual bottlenecks rather than assuming where the problems are. In one recent project, everyone thought the database was the issue, but it turned out to be unnecessary re-renders in our React components. We achieved a 60% reduction in load time by implementing React.memo strategically, optimizing our database queries, and adding a CDN layer for static assets.",
    ]
    return transcripts[questionIndex] || transcripts[0]
  }

  const toggleQuestion = (num: number) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else {
        next.add(num)
      }
      return next
    })
  }

  const handleDonate = () => {
    const paypalLink = `https://www.paypal.com/paypalme/MiroslavGruevski/${selectedAmount}`
    window.open(paypalLink, '_blank')
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Strong Hire':
        return 'bg-green-500/20 text-green-400 border-green-500'
      case 'Hire':
        return 'bg-green-500/10 text-green-400 border-green-500/50'
      case 'Lean Hire':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50'
      case 'Lean No Hire':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/50'
      case 'No Hire':
        return 'bg-red-500/10 text-red-400 border-red-500/50'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/50'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  if (!interview || !analysis) {
    return (
      <div className="min-h-screen gradient-mesh">
        {/* Fixed Skeleton Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-header">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
                <div className="w-px h-6 bg-gray-700 hidden sm:block" />
                <div className="w-24 h-6 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="w-32 h-9 bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className="h-16" />

        <main id="main-content" className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {/* Skeleton Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full mb-4">
              <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse" />
              <div className="w-40 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="w-64 h-8 bg-gray-700 rounded mx-auto mb-2 animate-pulse" />
            <div className="w-48 h-4 bg-gray-700 rounded mx-auto animate-pulse" />
          </div>

          {/* Skeleton Overall Score */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="w-32 h-4 bg-gray-700 rounded mb-3 animate-pulse" />
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="w-20 h-16 bg-gray-700 rounded animate-pulse" />
                  <div className="w-8 h-6 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="w-24 h-8 bg-gray-700 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 max-w-md">
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton Skills Breakdown */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
              <div className="w-40 h-6 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="w-12 h-4 bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((section) => (
              <div key={section} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
                  <div className="w-32 h-5 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-full">
              <div className="w-5 h-5 border-2 border-sunset-coral border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400">Analyzing your interview responses...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const personaInfo = getPersonaDisplay(interview.persona)

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="btn-ghost !px-3 !py-2 flex items-center gap-2 text-sm press-effect"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="w-px h-6 bg-white/10 hidden sm:block" />
              <Link href="/" className="flex items-center gap-2">
                <img src="/PrepScore-symbol.svg" alt="" className="w-7 h-7" />
                <span className="text-xl font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                  PrepScore
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/interview/new">
                <button className="btn-primary !px-4 !py-2.5 !rounded-xl text-sm flex items-center gap-2 press-effect">
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Practice Again</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <main id="main-content" className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 badge badge-success mb-4 animate-bounce-in">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Interview Analysis Complete</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
              {interview.roleDescription}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-gray-400">
            <span>{personaInfo.emoji} {personaInfo.label}</span>
            {interview.focusCategory && focusCategoryInfo[interview.focusCategory] && (
              <>
                <span>•</span>
                <span className="badge text-xs">
                  {focusCategoryInfo[interview.focusCategory].emoji} {focusCategoryInfo[interview.focusCategory].label} Focus
                </span>
              </>
            )}
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="glass-card p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">Overall Performance</p>
              {analysis.overallScore > 0 ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore.toFixed(1)}
                    </span>
                    <span className="text-2xl text-gray-500">/10</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mt-4 ${getVerdictStyle(analysis.verdict)}`}>
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{analysis.verdict}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-500">--</span>
                    <span className="text-2xl text-gray-600">/10</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mt-4 bg-gray-500/10 text-gray-400 border-gray-500/50">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold">{analysis.verdict}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 max-w-md">
              <p className="text-gray-300 text-sm leading-relaxed">
                {analysis.overallFeedback}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        {analysis.skills.length > 0 && (
          <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-sunset-coral" />
              Skills Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
              {analysis.skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4 p-4 glass-card-subtle hover-lift">
                  <span className="text-2xl">{skill.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(skill.trend)}
                        <span className={`font-bold ${getScoreColor(skill.score)}`}>
                          {skill.score}/10
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${getScoreBg(skill.score)}`}
                        style={{ width: `${skill.score * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Improvements */}
        {(analysis.topStrengths.length > 0 || analysis.topImprovements.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Strengths */}
            <div className="glass-card !border-green-500/20 p-6">
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                💪 Strengths
              </h2>
              {analysis.topStrengths.length > 0 ? (
                <ul className="space-y-3 stagger-children">
                  {analysis.topStrengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Complete your interview to see strengths</p>
              )}
            </div>

            {/* Improvements */}
            <div className="glass-card !border-orange-500/20 p-6">
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-400" />
                📈 Areas to Improve
              </h2>
              {analysis.topImprovements.length > 0 ? (
                <ul className="space-y-3 stagger-children">
                  {analysis.topImprovements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Complete your interview to see improvements</p>
              )}
            </div>
          </div>
        )}

        {/* Action Items */}
        {analysis.actionItems.length > 0 && (
          <div className="bg-sunset-coral/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-sunset-coral/20">
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-sunset-coral" />
              🎯 Action Items for Next Interview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.actionItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-sunset-coral/20 text-sunset-coral text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question-by-Question Feedback */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sunset-coral" />
            Question-by-Question Feedback
          </h2>
          <div className="space-y-3">
            {analysis.questionFeedback.map((qf) => {
              const qInfo = getQuestionTypeDisplay(qf.questionType as any)
              const isExpanded = expandedQuestions.has(qf.questionNumber)
              
              return (
                <div key={qf.questionNumber} className="border border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(qf.questionNumber)}
                    className="w-full flex items-center justify-between p-4 bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getScoreBg(qf.score)} text-white`}>
                        {qf.score}
                      </span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{qInfo.emoji}</span>
                          <span className="text-white font-medium">Q{qf.questionNumber}: {qInfo.label}</span>
                        </div>
                        <p className="text-gray-500 text-sm truncate max-w-md">
                          {qf.questionText}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 bg-gray-900/30 border-t border-gray-700 space-y-4">
                      {/* Question */}
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-blue-400 text-xs font-medium mb-1 uppercase tracking-wider">Question Asked</p>
                        <p className="text-gray-300 text-sm">"{qf.questionText}"</p>
                      </div>
                      
                      {/* Transcript - Your Response */}
                      {qf.transcript && (
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <p className="text-purple-400 text-xs font-medium uppercase tracking-wider">Your Response (Transcribed)</p>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {qf.transcript}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {qf.transcript.split(' ').length} words • ~{Math.ceil(qf.transcript.split(' ').length / 150)} min speaking time
                          </p>
                        </div>
                      )}
                      
                      {/* Feedback Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                          <h4 className="text-green-400 text-sm font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            What You Did Well
                          </h4>
                          <ul className="space-y-1">
                            {qf.strengths.map((s, i) => (
                              <li key={i} className="text-gray-400 text-sm">• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                          <h4 className="text-orange-400 text-sm font-medium mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Room for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {qf.improvements.map((imp, i) => (
                              <li key={i} className="text-gray-400 text-sm">• {imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Key Takeaway */}
                      <div className="p-3 bg-sunset-coral/10 rounded-lg border border-sunset-coral/20">
                        <p className="text-sunset-coral text-sm">
                          💡 <strong>Key Takeaway:</strong> {qf.keyTakeaway}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Donation Section */}
        <div className="glass-card-subtle p-5 mb-8">
          <p className="text-gray-400 text-sm text-center mb-4">
            ☕ If PrepScore helped you, consider buying us a coffee
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[3, 5, 10, 25].map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedAmount === amount
                    ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={handleDonate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all border border-gray-700"
            >
              Donate ${selectedAmount} via PayPal
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/interview/new" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sunset-rose to-sunset-coral text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              <RefreshCw className="w-5 h-5" />
              Practice Again
            </button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all">
              View All Sessions
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
