"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

interface Interview {
  id: string
  roleDescription: string
  persona: string
  questionType: string
  createdAt: string
  analyzedAt: string | null
  signalsDetected: Array<{
    id: string
    name: string
    score: number
  }>
}

interface RecentInterviewsProps {
  interviews: Interview[]
}

export function RecentInterviews({ interviews: initialInterviews }: RecentInterviewsProps) {
  const [interviews, setInterviews] = useState(initialInterviews)
  const [showAll, setShowAll] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const displayedInterviews = showAll ? interviews : interviews.slice(0, 3)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm("Are you sure you want to delete this interview?")) {
      return
    }

    setDeletingId(id)
    
    try {
      const response = await fetch(`/api/interviews/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInterviews(interviews.filter(i => i.id !== id))
      } else {
        alert("Failed to delete interview")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete interview")
    } finally {
      setDeletingId(null)
    }
  }

  if (interviews.length === 0) {
    return (
      <div className="card-material">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-900">Recent Interviews</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
          <p className="text-gray-600 mb-6">Start your first practice session to see your progress here</p>
          <Link href="/interview/new" className="btn-filled">
            Start Your First Interview
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card-material">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-900">Recent Interviews</h2>
        {interviews.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="btn-text text-sm flex items-center gap-1"
          >
            {showAll ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                View All ({interviews.length})
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedInterviews.map((interview) => (
          <div
            key={interview.id}
            className="relative"
          >
            <div className="flex gap-2 sm:gap-3">
              <Link
                href={`/interview/results/${interview.id}`}
                className="flex-1 p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-medium text-gray-900 truncate">{interview.roleDescription}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      <span className="capitalize">{interview.persona}</span> • {interview.questionType}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(interview.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {interview.analyzedAt && interview.signalsDetected.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {interview.signalsDetected.slice(0, 3).map((signal) => (
                      <span
                        key={signal.id}
                        className="text-xs px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                      >
                        <span className="hidden sm:inline">{signal.name}: </span>
                        <span className="sm:hidden">{signal.name.slice(0, 3)}: </span>
                        {signal.score}/10
                      </span>
                    ))}
                  </div>
                )}
              </Link>
              
              {/* 3-Dot Menu */}
              <div className="relative flex-shrink-0" ref={openMenuId === interview.id ? menuRef : null}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === interview.id ? null : interview.id)
                  }}
                  className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 h-full"
                  title="More options"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openMenuId === interview.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href={`/interview/results/${interview.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenMenuId(null)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Results
                    </Link>
                    
                    <div className="h-px bg-gray-200 my-1" />
                    
                    <button
                      onClick={(e) => {
                        setOpenMenuId(null)
                        handleDelete(e, interview.id)
                      }}
                      disabled={deletingId === interview.id}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50"
                    >
                      {deletingId === interview.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

