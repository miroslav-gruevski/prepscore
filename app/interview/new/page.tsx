'use client'

import Link from 'next/link'
import { useState } from 'react'
import { InterviewSetupForm } from "@/components/interview/InterviewSetupForm"
import { Check } from 'lucide-react'

export default function NewInterviewPage() {
  const [stepStates, setStepStates] = useState({
    role: false,
    persona: false,
    question: false,
  })

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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Start New Interview
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Set up your practice session in 3 simple steps
          </p>
          
          {/* Visual Stepper */}
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Step 1 - Role */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  stepStates.role 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-sunset-rose to-sunset-coral'
                }`}>
                  {stepStates.role ? (
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  ) : (
                    <span className="text-white font-bold text-lg">1</span>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-xs font-medium transition-colors ${
                    stepStates.role ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    Choose Role
                  </span>
                </div>
              </div>
            </div>
            
            {/* Connector Line 1->2 */}
            <div className={`w-16 h-0.5 transition-all duration-300 ${
              stepStates.role 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gray-700'
            }`}></div>
            
            {/* Step 2 - Persona */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  stepStates.persona
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : stepStates.role
                    ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral'
                    : 'bg-gray-700'
                }`}>
                  {stepStates.persona ? (
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  ) : (
                    <span className={`font-bold text-lg transition-colors ${
                      stepStates.role ? 'text-white' : 'text-gray-500'
                    }`}>2</span>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-xs font-medium transition-colors ${
                    stepStates.persona ? 'text-green-400' : stepStates.role ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pick Persona
                  </span>
                </div>
              </div>
            </div>
            
            {/* Connector Line 2->3 */}
            <div className={`w-16 h-0.5 transition-all duration-300 ${
              stepStates.persona
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gray-700'
            }`}></div>
            
            {/* Step 3 - Question */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  stepStates.question
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : stepStates.persona
                    ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral'
                    : 'bg-gray-700'
                }`}>
                  {stepStates.question ? (
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  ) : (
                    <span className={`font-bold text-lg transition-colors ${
                      stepStates.persona ? 'text-white' : 'text-gray-500'
                    }`}>3</span>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-xs font-medium transition-colors ${
                    stepStates.question ? 'text-green-400' : stepStates.persona ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Select Question
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <InterviewSetupForm onStepChange={setStepStates} />
      </main>
    </div>
  )
}
