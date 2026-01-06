'use client'

import { use, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Video, VideoOff, Mic, MicOff, Play, Square, 
  CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import { getQuestionTypeDisplay } from '@/lib/question-generator'

interface Question {
  questionNumber: number
  questionType: string
  questionText: string
}

interface InterviewData {
  id: string
  roleDescription: string
  persona: string
  focusCategory?: string
  questions: Question[]
  answers: Record<number, { duration: number; recorded: boolean }>
  startedAt: string
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

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  
  // Interview state
  const [interview, setInterview] = useState<InterviewData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  
  // Camera/mic state
  const [hasCamera, setHasCamera] = useState(false)
  const [hasMic, setHasMic] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load interview data
  useEffect(() => {
    const storedInterview = sessionStorage.getItem(`interview_${id}`)
    if (storedInterview) {
      setInterview(JSON.parse(storedInterview))
    } else {
      router.push('/interview/new')
    }
  }, [id, router])

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      
      streamRef.current = stream
      setHasCamera(true)
      setHasMic(true)
      setPermissionError(null)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error: any) {
      console.error('Camera error:', error)
      setPermissionError(
        error.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow access.'
          : 'Could not access camera.'
      )
    }
  }, [])

  useEffect(() => {
    initializeCamera()
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [initializeCamera])

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicEnabled(audioTrack.enabled)
      }
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return
    
    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9,opus'
    })
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      console.log('Recording completed:', blob.size, 'bytes')
      
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion]))
      
      if (interview) {
        const updatedInterview = {
          ...interview,
          answers: {
            ...interview.answers,
            [currentQuestion]: { duration: recordingTime, recorded: true, uploading: true }
          }
        }
        setInterview(updatedInterview)
        sessionStorage.setItem(`interview_${id}`, JSON.stringify(updatedInterview))
        
        // Upload to Vercel Blob if not a demo interview
        const isDemoInterview = id.startsWith('demo_') || id.startsWith('demo-')
        
        if (!isDemoInterview) {
          console.log('[Session] Uploading recording for real interview:', id)
          try {
            const formData = new FormData()
            formData.append('audio', blob, `recording-q${currentQuestion}.webm`)
            formData.append('interviewId', id)
            formData.append('questionNumber', currentQuestion.toString())
            
            const uploadResponse = await fetch('/api/recordings/upload', {
              method: 'POST',
              body: formData,
            })
            
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json()
              console.log('[Session] Recording uploaded:', uploadData.url)
              
              // Trigger transcription
              console.log('[Session] Triggering transcription...')
              const transcribeResponse = await fetch('/api/recordings/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  interviewId: id,
                  questionNumber: currentQuestion,
                  audioUrl: uploadData.url,
                }),
              })
              
              if (transcribeResponse.ok) {
                const transcribeData = await transcribeResponse.json()
                console.log('[Session] Transcription complete:', transcribeData.transcript?.substring(0, 100))
              } else {
                console.error('[Session] Transcription failed:', await transcribeResponse.text())
              }
            } else {
              console.error('[Session] Upload failed:', await uploadResponse.text())
            }
          } catch (error) {
            console.error('[Session] Error uploading/transcribing recording:', error)
          }
        } else {
          console.log('[Session] Demo interview - skipping upload/transcription')
        }
        
        // Update state to mark as uploaded
        const finalInterview = {
          ...updatedInterview,
          answers: {
            ...updatedInterview.answers,
            [currentQuestion]: { duration: recordingTime, recorded: true, uploading: false }
          }
        }
        setInterview(finalInterview)
        sessionStorage.setItem(`interview_${id}`, JSON.stringify(finalInterview))
      }
    }
    
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(1000)
    setIsRecording(true)
    setRecordingTime(0)
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const goToQuestion = (num: number) => {
    if (isRecording) {
      stopRecording()
    }
    setCurrentQuestion(num)
    setRecordingTime(0)
  }

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const finishInterview = async () => {
    if (isRecording) {
      stopRecording()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    // Only trigger AI analysis for real interviews (not demo)
    const isDemoId = id.startsWith('demo_') || id.startsWith('demo-')
    
    if (!isDemoId && answeredQuestions.size > 0) {
      setIsAnalyzing(true)
      
      try {
        // Wait a moment for any pending transcriptions to complete
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Trigger AI analysis
        console.log('[Session] Triggering AI analysis...')
        const analyzeResponse = await fetch(`/api/interviews/${id}/analyze`, {
          method: 'POST',
        })
        
        if (analyzeResponse.ok) {
          const analyzeData = await analyzeResponse.json()
          console.log('[Session] Analysis complete:', analyzeData.analysis?.overallScore)
        } else {
          console.error('[Session] Analysis failed:', await analyzeResponse.text())
        }
      } catch (error) {
        console.error('[Session] Error during analysis:', error)
      }
    }
    
    router.push(`/interview/results/${id}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!interview) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-sunset-coral/30 border-t-sunset-coral rounded-full animate-spin" />
          <div className="text-xl text-gray-400">Loading interview...</div>
        </div>
      </div>
    )
  }

  const currentQ = interview.questions.find(q => q.questionNumber === currentQuestion)
  const questionInfo = currentQ ? getQuestionTypeDisplay(currentQ.questionType as any) : null

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-sunset-coral/30 border-t-sunset-coral rounded-full animate-spin" />
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Analyzing Your Interview
            </h2>
            <p className="text-gray-400 mb-4">
              Our AI is reviewing your responses and generating personalized feedback...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-sunset-coral rounded-full animate-pulse" />
              This usually takes 10-15 seconds
            </div>
          </div>
        </div>
      )}

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/PrepScore-symbol.svg" alt="" className="w-6 h-6" />
              <span className="text-lg font-display font-bold bg-gradient-to-r from-sunset-rose to-sunset-coral bg-clip-text text-transparent">
                PrepScore
              </span>
            </Link>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="hidden sm:inline text-gray-300 text-sm truncate max-w-[150px] lg:max-w-[250px]">
              {interview.roleDescription}
            </span>
            {interview.focusCategory && focusCategoryInfo[interview.focusCategory] && (
              <>
                <span className="hidden md:inline text-gray-500">•</span>
                <span className="hidden md:inline badge text-xs">
                  {focusCategoryInfo[interview.focusCategory].emoji} {focusCategoryInfo[interview.focusCategory].label}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-primary">
              <span className="font-bold">{answeredQuestions.size}</span>/5 answered
            </span>
            <button
              onClick={finishInterview}
              disabled={answeredQuestions.size === 0 || isAnalyzing}
              className={`btn-primary !px-4 !py-2 !rounded-xl text-sm press-effect ${
                answeredQuestions.size === 0 || isAnalyzing ? '!opacity-50 !cursor-not-allowed' : ''
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : 'Finish'}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 flex-shrink-0" />

      {/* Main Content - Flexible height */}
      <main id="main-content" className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
        
        {/* Left: Camera + Controls */}
        <div className="lg:w-[400px] flex flex-col gap-3">
          {/* Camera Preview - Smaller */}
          <div className="relative aspect-[4/3] glass-card overflow-hidden !p-0">
            {permissionError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-red-400 text-sm mb-2">{permissionError}</p>
                <button
                  onClick={initializeCamera}
                  className="btn-primary !px-4 !py-2 !rounded-xl text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  aria-label="Camera preview"
                  className={`w-full h-full object-cover ${!cameraEnabled ? 'hidden' : ''}`}
                />
                {!cameraEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90" aria-label="Camera is off">
                    <VideoOff className="w-12 h-12 text-gray-600" aria-hidden="true" />
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div 
                    className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full animate-pulse-glow shadow-lg shadow-red-500/50"
                    role="status"
                    aria-live="polite"
                    aria-label={`Recording in progress: ${formatTime(recordingTime)}`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true" />
                    <span className="text-white text-xs font-medium">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls - Compact */}
          <div className="flex items-center justify-center gap-3 p-3 glass-card-subtle" role="toolbar" aria-label="Recording controls">
            <button
              onClick={toggleCamera}
              aria-label={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
              aria-pressed={cameraEnabled}
              className={`btn-icon transition-all duration-300 press-effect ${
                !cameraEnabled ? '!bg-red-500/20 !text-red-400 !border-red-500/30' : ''
              }`}
            >
              {cameraEnabled ? <Video className="w-4 h-4" aria-hidden="true" /> : <VideoOff className="w-4 h-4" aria-hidden="true" />}
            </button>
            
            <button
              onClick={toggleMic}
              aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
              aria-pressed={micEnabled}
              className={`btn-icon transition-all duration-300 press-effect ${
                !micEnabled ? '!bg-red-500/20 !text-red-400 !border-red-500/30' : ''
              }`}
            >
              {micEnabled ? <Mic className="w-4 h-4" aria-hidden="true" /> : <MicOff className="w-4 h-4" aria-hidden="true" />}
            </button>

            <div className="w-px h-6 bg-white/10" aria-hidden="true" />

            {isRecording ? (
              <button
                onClick={stopRecording}
                aria-label={`Stop recording. Current duration: ${formatTime(recordingTime)}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all text-sm font-medium press-effect shadow-lg shadow-red-500/30"
              >
                <Square className="w-4 h-4" aria-hidden="true" />
                Stop
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={!hasCamera || !hasMic}
                aria-label="Start recording your answer"
                aria-disabled={!hasCamera || !hasMic}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sunset-rose to-sunset-coral text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-sm font-medium"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                Record
              </button>
            )}
          </div>

          {/* Question Pills - Horizontal */}
          <nav className="flex gap-2 justify-center p-3 glass-card-subtle" role="navigation" aria-label="Question navigation">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => goToQuestion(num)}
                aria-label={`Go to question ${num}${answeredQuestions.has(num) ? ' (answered)' : ''}${currentQuestion === num ? ' (current)' : ''}`}
                aria-current={currentQuestion === num ? 'step' : undefined}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 press-effect ${
                  currentQuestion === num
                    ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white scale-110 shadow-lg shadow-sunset-coral/40'
                    : answeredQuestions.has(num)
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {answeredQuestions.has(num) ? <CheckCircle className="w-4 h-4" /> : num}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Current Question + Question List */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Current Question - Prominent */}
          <div className={`glass-card p-6 transition-all duration-500 ${
            isRecording ? '!border-red-500/50 !bg-red-900/20' : ''
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{questionInfo?.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge">
                    {questionInfo?.label}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Question {currentQuestion}/5
                  </span>
                </div>
              </div>
              
              {answeredQuestions.has(currentQuestion) && (
                <span className="ml-auto badge badge-success">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Done
                </span>
              )}
            </div>

            <p className="text-xl lg:text-2xl text-white leading-relaxed font-medium">
              {currentQ?.questionText}
            </p>

            {isRecording && (
              <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-glow" />
                Recording your answer...
              </div>
            )}
          </div>

          {/* All Questions */}
          <div className="space-y-2 stagger-children">
            {interview.questions.map((q) => {
              const qInfo = getQuestionTypeDisplay(q.questionType as any)
              const isAnswered = answeredQuestions.has(q.questionNumber)
              const isCurrent = q.questionNumber === currentQuestion
              
              return (
                <button
                  key={q.questionNumber}
                  onClick={() => goToQuestion(q.questionNumber)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-3 press-effect ${
                    isCurrent
                      ? 'card-selected'
                      : isAnswered
                      ? 'glass-card-subtle !border-green-500/30'
                      : 'glass-card-subtle hover:border-white/20'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-sunset-rose to-sunset-coral text-white shadow-lg shadow-sunset-coral/30'
                      : isAnswered 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {isAnswered ? <CheckCircle className="w-4 h-4" /> : q.questionNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span>{qInfo.emoji}</span>
                      <span className="text-xs text-gray-500">{qInfo.label}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {q.questionText}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="badge badge-primary text-xs">Current</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
