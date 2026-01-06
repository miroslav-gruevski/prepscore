'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <img src="/PrepScore-symbol.svg" alt="" className="w-8 h-8" />
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
            PrepScore
          </span>
        </Link>

        {/* Error Content */}
        <div className="bg-gray-800/70 backdrop-blur-sm p-12 rounded-2xl border-2 border-gray-700 shadow-lg">
          <div className="text-8xl mb-6">⚠️</div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Something Went Wrong
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>

          {error.message && (
            <div className="mb-8 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-left">
              <p className="text-sm font-mono text-red-400 break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 gradient-sunset text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              Try Again
            </button>
            
            <Link 
              href="/"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 border-2 border-gray-600"
            >
              Go Home
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-gray-400">
          <Link href="/interview/new" className="hover:text-sunset-coral transition-colors">
            Start Interview
          </Link>
          <span className="text-gray-700">•</span>
          <Link href="/dashboard" className="hover:text-sunset-coral transition-colors">
            Dashboard
          </Link>
          <span className="text-gray-700">•</span>
          <Link href="/" className="hover:text-sunset-coral transition-colors">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

