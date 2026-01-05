'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronDown, ChevronUp, Coffee } from 'lucide-react'

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [interview, setInterview] = useState<any>(null)
  const [transcriptExpanded, setTranscriptExpanded] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState(9)

  useEffect(() => {
    // Try to get interview data from sessionStorage (if user just completed an interview)
    const storedInterview = sessionStorage.getItem(`interview_${id}`)
    let interviewData
    
    if (storedInterview) {
      // Use stored data if available
      const parsed = JSON.parse(storedInterview)
      interviewData = {
        ...parsed,
        transcript: "Sample transcript would appear here...",
        analyzedAt: new Date().toISOString(),
        signalsDetected: [
          {
            id: "1",
            name: "Problem Framing",
            score: 8,
            definition: "Strong ability to understand and articulate problem constraints",
            evidence: "Candidate clearly outlined the requirements and discussed trade-offs between different approaches",
            evaluation: "Demonstrated excellent problem decomposition skills",
          },
          {
            id: "2",
            name: "Technical Depth",
            score: 7,
            definition: "Deep understanding of technical concepts and implementation details",
            evidence: "Explained token bucket algorithm and its advantages over sliding window",
            evaluation: "Good technical knowledge, could have discussed edge cases more",
          },
          {
            id: "3",
            name: "Communication Clarity",
            score: 9,
            definition: "Ability to explain complex ideas clearly and concisely",
            evidence: "Used clear examples and analogies throughout the explanation",
            evaluation: "Exceptional communication skills, easy to follow",
          },
        ],
      }
    } else {
      // Fallback to mock data
      interviewData = {
        id,
        roleDescription: "Senior React Engineer",
        persona: "technical",
        question: "How would you design a rate limiter for an API?",
        questionType: "technical",
        transcript: "Sample transcript would appear here...",
        analyzedAt: new Date().toISOString(),
        signalsDetected: [
          {
            id: "1",
            name: "Problem Framing",
            score: 8,
            definition: "Strong ability to understand and articulate problem constraints",
            evidence: "Candidate clearly outlined the requirements and discussed trade-offs between different approaches",
            evaluation: "Demonstrated excellent problem decomposition skills",
          },
          {
            id: "2",
            name: "Technical Depth",
            score: 7,
            definition: "Deep understanding of technical concepts and implementation details",
            evidence: "Explained token bucket algorithm and its advantages over sliding window",
            evaluation: "Good technical knowledge, could have discussed edge cases more",
          },
          {
            id: "3",
            name: "Communication Clarity",
            score: 9,
            definition: "Ability to explain complex ideas clearly and concisely",
            evidence: "Used clear examples and analogies throughout the explanation",
            evaluation: "Exceptional communication skills, easy to follow",
          },
        ],
      }
    }
    
    setInterview(interviewData)
  }, [id])

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-2xl text-gray-400">Loading...</div>
      </div>
    )
  }

  const avgScore = interview.signalsDetected.reduce((sum: number, sig: any) => sum + sig.score, 0) / interview.signalsDetected.length

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-900/20 border-green-800'
    if (score >= 6) return 'bg-yellow-900/20 border-yellow-800'
    return 'bg-red-900/20 border-red-800'
  }

  const handleDonate = () => {
    const amount = customAmount || selectedAmount
    // PayPal donation link
    const paypalLink = `https://www.paypal.com/paypalme/MiroslavGruevski/${amount}`
    window.open(paypalLink, '_blank')
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
              <Link href="/dashboard">
                <button className="px-6 py-2.5 text-sm font-medium text-sunset-rose hover:text-sunset-coral transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <h1 className="text-5xl font-display font-bold text-white">
              Interview Analysis Complete
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            {interview.roleDescription} • {interview.persona} interviewer
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzed on {new Date(interview.analyzedAt).toLocaleString()}
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-sunset-rose/10 to-sunset-coral/10 backdrop-blur-sm rounded-2xl p-12 mb-12 border-2 border-sunset-rose/30 shadow-xl">
          <div className="text-center">
            <p className="text-base font-medium text-gray-400 mb-3">Overall Performance</p>
            <p className={`text-7xl font-display font-bold mb-3 ${getScoreColor(avgScore)}`}>
              {avgScore.toFixed(1)}/10
            </p>
            <p className="text-gray-400 text-lg">
              {avgScore >= 8 ? "Excellent performance! 🎉" : avgScore >= 6 ? "Good job! Keep practicing 💪" : "Room for improvement 📈"}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-12 border-2 border-gray-700 shadow-lg">
          <h2 className="text-xl font-display font-semibold text-white mb-3">
            Interview Question
          </h2>
          <p className="text-gray-300 italic text-lg">
            "{interview.question}"
          </p>
        </div>

        {/* Signals Detected */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Hiring Signals Detected
          </h2>
          <div className="space-y-8">
            {interview.signalsDetected.map((signal: any) => (
              <div
                key={signal.id}
                className={`rounded-2xl p-8 border-2 shadow-lg ${getScoreBg(signal.score)}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-semibold text-white mb-2">
                      {signal.name}
                    </h3>
                    <p className="text-base text-gray-400 italic">
                      {signal.definition}
                    </p>
                  </div>
                  <div className={`text-4xl font-display font-bold ml-6 ${getScoreColor(signal.score)}`}>
                    {signal.score}/10
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Evidence
                    </p>
                    <p className="text-gray-300 bg-gray-900/30 rounded-lg p-4 text-base">
                      {signal.evidence}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Evaluation
                    </p>
                    <p className="text-gray-300 bg-gray-900/30 rounded-lg p-4 text-base">
                      {signal.evaluation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript Section */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border-2 border-gray-700 shadow-lg overflow-hidden mb-12">
          <button
            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
            className="w-full p-8 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <h2 className="text-2xl font-display font-semibold text-white">
              Your Response Transcript
            </h2>
            {transcriptExpanded ? (
              <ChevronUp className="w-7 h-7 text-sunset-rose" />
            ) : (
              <ChevronDown className="w-7 h-7 text-sunset-rose" />
            )}
          </button>

          {transcriptExpanded && (
            <div className="px-8 pb-8 border-t border-gray-700">
              <div className="mt-6 p-6 bg-gray-900 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap font-mono text-base">
                  {interview.transcript}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Donation Section */}
        <div className="bg-gradient-to-br from-sunset-rose/10 to-sunset-coral/10 backdrop-blur-sm rounded-2xl p-10 mb-12 border-2 border-sunset-rose/30 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              ☕ Buy us a coffee?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              If PrepScore helped you, consider supporting us! Your donation helps keep this tool free and continuously improving.
            </p>
          </div>

          {/* Quick Amount Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {[5, 9, 15, 25].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount)
                  setCustomAmount("")
                }}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
                  selectedAmount === amount && !customAmount
                    ? "bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg scale-105"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-base font-semibold text-gray-300 mb-3 text-center">
              Or enter custom amount:
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sunset-rose focus:border-transparent transition-all text-lg placeholder-gray-500"
              />
            </div>
          </div>

          {/* Donate Button */}
          <div className="text-center">
            <button
              onClick={handleDonate}
              className="btn-sunset inline-flex items-center gap-2"
            >
              <Coffee className="w-5 h-5" />
              Donate via PayPal
            </button>
            <p className="text-sm text-gray-400 mt-4">
              Secure payment through PayPal • No account required
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/interview/new">
            <button className="btn-sunset">
              Practice Another Interview
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-outlined-sunset">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
