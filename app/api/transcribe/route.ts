import { NextRequest, NextResponse } from 'next/server'
import { 
  transcribeAudio, 
  transcribeAndAnalyze,
  getActiveTranscriptionProvider,
  getAvailableProviders,
  type TranscriptionProvider 
} from '@/lib/transcription-provider'
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from '@/lib/rate-limit'

// POST /api/transcribe
// Transcribes audio using Deepgram or Gemini
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 transcriptions per minute
    const identifier = getIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier, 10, 60)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait before transcribing more audio.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Get audio data from request
    const contentType = request.headers.get('content-type') || ''
    
    let audioBuffer: Buffer | ArrayBuffer
    let provider: TranscriptionProvider | undefined
    let withAnalysis = false
    let roleContext = ''
    
    if (contentType.includes('application/json')) {
      // Handle base64 encoded audio
      const body = await request.json()
      const { audio, mimeType } = body
      
      // Optional: specify provider and analysis options
      provider = body.provider as TranscriptionProvider | undefined
      withAnalysis = body.withAnalysis || false
      roleContext = body.roleContext || ''
      
      if (!audio) {
        return NextResponse.json(
          { error: 'Audio data is required' },
          { status: 400 }
        )
      }
      
      // Decode base64
      const base64Data = audio.replace(/^data:audio\/\w+;base64,/, '')
      audioBuffer = Buffer.from(base64Data, 'base64')
    } else {
      // Handle raw audio/form data
      const formData = await request.formData()
      const audioFile = formData.get('audio') as File | null
      provider = formData.get('provider') as TranscriptionProvider | null || undefined
      withAnalysis = formData.get('withAnalysis') === 'true'
      roleContext = formData.get('roleContext') as string || ''
      
      if (!audioFile) {
        return NextResponse.json(
          { error: 'Audio file is required' },
          { status: 400 }
        )
      }
      
      audioBuffer = await audioFile.arrayBuffer()
    }

    // Check if any transcription provider is configured
    const availableProviders = getAvailableProviders()
    if (availableProviders.length === 0) {
      // Return demo transcript for development
      console.log('[Transcribe] No provider configured, returning demo transcript')
      return NextResponse.json(
        {
          success: true,
          transcript: getDemoTranscript(),
          provider: 'demo',
          isDemoMode: true,
        },
        {
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Transcribe with selected or default provider
    const activeProvider = provider || getActiveTranscriptionProvider()
    console.log(`[Transcribe] Processing audio with ${activeProvider}...`)
    
    let result
    
    if (withAnalysis && roleContext) {
      // Use combined transcription + analysis (Gemini preferred)
      result = await transcribeAndAnalyze(audioBuffer, roleContext)
    } else {
      // Standard transcription
      result = await transcribeAudio(audioBuffer, { provider })
    }

    return NextResponse.json(
      {
        success: true,
        transcript: result.transcript,
        confidence: result.confidence,
        duration: result.duration,
        analysis: result.analysis,
        provider: activeProvider,
        isDemoMode: false,
      },
      {
        headers: getRateLimitHeaders(rateLimitResult)
      }
    )
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}

// GET /api/transcribe
// Returns available providers and current configuration
export async function GET() {
  const availableProviders = getAvailableProviders()
  const activeProvider = getActiveTranscriptionProvider()
  
  return NextResponse.json({
    activeProvider,
    availableProviders,
    isConfigured: availableProviders.length > 0,
    providers: {
      deepgram: {
        configured: availableProviders.includes('deepgram'),
        description: 'Fast and accurate speech-to-text',
        features: ['High accuracy', 'Low latency', 'Punctuation', 'Paragraphs'],
      },
      gemini: {
        configured: availableProviders.includes('gemini'),
        description: 'AI-powered transcription with analysis',
        features: ['Transcription', 'Tone analysis', 'Confidence scoring', 'Suggestions'],
      },
    },
  })
}

// Demo transcripts for when no provider is configured
function getDemoTranscript(): string {
  const demoTranscripts = [
    "I would approach this problem by first understanding the core requirements and constraints. In my previous role, I led a similar initiative where we had to balance performance with maintainability. We started by conducting a thorough analysis of the existing system, identified the bottlenecks, and then implemented a phased rollout strategy. The key was constant communication with stakeholders and iterative improvements based on real user feedback.",
    "That's a great question. When I think about system design at scale, I always start with the fundamentals: what are the access patterns, what's the expected load, and what are the consistency requirements? For this particular scenario, I would recommend a microservices architecture with event-driven communication. We'd use a message queue for decoupling, implement caching at multiple levels, and ensure we have proper monitoring and alerting in place.",
    "In my experience, the most effective way to handle this situation is through clear communication and empathy. I remember a time when I had to navigate a disagreement between two senior team members about the technical direction of a project. I scheduled individual one-on-ones first to understand each perspective, then facilitated a collaborative session where we could align on shared goals. The outcome was actually better than either initial proposal.",
    "I'm passionate about mentoring because I believe it creates a multiplier effect for the entire team. My approach involves setting up regular one-on-ones, creating stretch assignments that push people slightly outside their comfort zone, and always providing context for the 'why' behind decisions. I've seen junior developers grow into technical leads using this method.",
    "When it comes to optimizing performance, I take a data-driven approach. First, I establish baseline metrics and identify the critical path. Then I use profiling tools to pinpoint the actual bottlenecks rather than assuming. In one project, we achieved a 60% reduction in load time by implementing code splitting, optimizing our database queries, and adding a CDN layer.",
  ]
  
  return demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)]
}
