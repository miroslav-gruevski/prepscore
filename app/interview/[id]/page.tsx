// Interview Recording Page - No Database Required
'use client'

import { useEffect } from "react"
import { VideoRecorder } from "@/components/interview/VideoRecorder"
import Link from "next/link"
import { use } from "react"

export default function InterviewRecordingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // Mock interview data for testing (no database required)
  // In production, this would fetch from the database
  const interview = {
    id: id,
    roleDescription: "Senior React Engineer",
    persona: "technical",
    question: "How would you design a rate limiter for an API?",
    questionType: "technical",
  }

  // Store interview data in sessionStorage for results page
  useEffect(() => {
    sessionStorage.setItem(`interview_${id}`, JSON.stringify(interview))
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                PrepScore
              </span>
            </Link>
            <div className="text-sm font-medium text-gray-400">
              Recording Session
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Interview Context Card */}
        <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700 shadow-lg mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-sunset-rose/10 text-sunset-rose rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-sunset-rose/30">
              📝
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-white mb-3">{interview.roleDescription}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                  Persona: {interview.persona}
                </span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                  Type: {interview.questionType}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-sunset-rose/5 to-sunset-coral/5 rounded-xl border border-sunset-rose/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 gradient-sunset text-white rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                ❓
              </div>
              <div>
                <p className="font-display font-semibold text-sunset-rose mb-2">Interview Question:</p>
                <p className="text-gray-300 leading-relaxed text-lg">{interview.question}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Recorder */}
        <VideoRecorder interviewId={interview.id} />
      </main>
    </div>
  )
}

