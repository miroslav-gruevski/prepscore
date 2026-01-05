"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

interface VideoRecorderProps {
  interviewId: string
}

export function VideoRecorder({ interviewId }: VideoRecorderProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleStart = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm;codecs=vp9",
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setCameraReady(true)
      setDuration(0)
    } catch (error: any) {
      console.error("Failed to access camera:", error)
      setError(error.message || "Camera access denied")
      setCameraReady(false)
    }
  }, [])

  const handleDemoMode = useCallback(() => {
    setDemoMode(true)
    setIsRecording(true)
    setDuration(0)
  }, [])

  const handleStop = useCallback(async () => {
    setIsRecording(false)

    // Demo mode - skip to results
    if (demoMode) {
      setIsProcessing(true)
      setTimeout(() => {
        router.push(`/interview/results/${interviewId}`)
      }, 1500)
      return
    }

    if (!mediaRecorderRef.current) return

    setIsProcessing(true)

    mediaRecorderRef.current.stop()

    // Stop all tracks
    stream?.getTracks().forEach((track) => track.stop())

    // Wait for all data to be collected
    mediaRecorderRef.current.onstop = async () => {
      try {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })

        // For demo purposes, skip upload and transcription
        // Just go to results with mock data
        console.log("[Demo] Skipping upload and transcription for testing")
        
        setTimeout(() => {
          router.push(`/interview/results/${interviewId}`)
        }, 1500)

        /* Production code (requires Vercel Blob + Deepgram):
        
        // Upload video
        const videoFormData = new FormData()
        videoFormData.append("file", blob, "interview.webm")
        videoFormData.append("interviewId", interviewId)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: videoFormData,
        })

        if (!uploadResponse.ok) throw new Error("Failed to upload video")

        const { url: videoUrl } = await uploadResponse.json()

        // Extract audio and transcribe
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioFormData = new FormData()
        audioFormData.append("audio", audioBlob, "interview.webm")

        const transcribeResponse = await fetch("/api/transcribe", {
          method: "POST",
          body: audioFormData,
        })

        if (!transcribeResponse.ok) throw new Error("Failed to transcribe")

        const { transcript } = await transcribeResponse.json()

        // Update interview with video URL and transcript
        await fetch(`/api/interviews/${interviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl,
            transcript,
            duration,
          }),
        })

        // Trigger analysis
        await fetch(`/api/interviews/${interviewId}/analyze`, {
          method: "POST",
        })

        // Redirect to results
        router.push(`/interview/results/${interviewId}`)
        */
      } catch (error) {
        console.error("Error processing recording:", error)
        setError("Failed to process recording. Please try again.")
        setIsProcessing(false)
      }
    }
  }, [interviewId, duration, stream, router, demoMode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700 shadow-lg">
      <div className="space-y-6">
        {/* Video Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700">
          {!cameraReady && !demoMode && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  📹
                </div>
                <p className="text-xl font-display font-bold mb-2">Camera Ready</p>
                <p className="text-sm text-gray-400">Click start to begin recording</p>
              </div>
            </div>
          )}
          
          {demoMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sunset-rose to-sunset-coral">
              <div className="text-center text-white p-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  ▶️
                </div>
                <p className="text-xl font-display font-bold mb-2">Demo Mode</p>
                <p className="text-sm text-white/80">Recording simulation in progress...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {isRecording && !demoMode && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-mono font-medium">{formatTime(duration)}</span>
            </div>
          )}
          
          {isRecording && demoMode && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-sunset-rose text-white px-4 py-2 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-mono font-medium">{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-yellow-400 mb-1">Camera Access Issue</h3>
                <p className="text-sm text-gray-300 mb-3">{error}</p>
                <p className="text-sm text-gray-400 mb-2">Try these solutions:</p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Click the camera icon in your browser's address bar to grant permissions</li>
                  <li>Reload the page and allow camera access</li>
                  <li>Check if another app is using your camera</li>
                  <li>Or use Demo Mode below to test the workflow</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isRecording && !isProcessing && (
            <>
              <button
                onClick={handleStart}
                className="px-8 py-4 gradient-sunset text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-lg">📹</span>
                Start Recording
              </button>
              
              <button
                onClick={handleDemoMode}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 border-2 border-gray-600 flex items-center justify-center gap-2"
              >
                <span className="text-lg">⚡</span>
                Try Demo Mode
              </button>
            </>
          )}
          
          {isRecording && (
            <button
              onClick={handleStop}
              className="bg-red-600 text-white rounded-xl px-8 py-4 font-medium hover:bg-red-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <span className="text-lg">⏹️</span>
              Stop & Get Feedback
            </button>
          )}
          
          {isProcessing && (
            <button
              disabled
              className="bg-gray-700 text-gray-400 rounded-xl px-8 py-4 font-medium cursor-not-allowed flex items-center justify-center gap-2 mx-auto opacity-50"
            >
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Your Response...
            </button>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && !isProcessing && (
          <div className="p-6 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
            <h3 className="font-display font-bold text-blue-400 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Recording Tips
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-sunset-coral mt-0.5">•</span>
                <span>Speak clearly and at a steady pace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sunset-coral mt-0.5">•</span>
                <span>Aim for 2-5 minutes of response time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sunset-coral mt-0.5">•</span>
                <span>Structure your answer with examples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sunset-coral mt-0.5">•</span>
                <span>Use Demo Mode if you're just testing the interface</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

