// Flexible Transcription Provider System
// Supports: Deepgram (fast/cheap), Gemini (richer analysis)

import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@deepgram/sdk"

export type TranscriptionProvider = "deepgram" | "gemini"

export interface TranscriptionResult {
  transcript: string
  confidence?: number
  duration?: number
  analysis?: {
    clarity: number
    confidence: number
    tone: string
    fillerWords: number
    suggestions: string[]
  }
}

// Configure which transcription provider to use
const ACTIVE_PROVIDER: TranscriptionProvider = 
  (process.env.TRANSCRIPTION_PROVIDER as TranscriptionProvider) || "deepgram"

// ============================================
// DEEPGRAM PROVIDER (Fast, Cheap, Accurate)
// ============================================
let deepgramClient: ReturnType<typeof createClient> | null = null

function getDeepgramClient() {
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY
    if (!apiKey) {
      throw new Error("DEEPGRAM_API_KEY is not configured")
    }
    deepgramClient = createClient(apiKey)
  }
  return deepgramClient
}

async function transcribeWithDeepgram(
  audioBuffer: Buffer | ArrayBuffer
): Promise<TranscriptionResult> {
  const buffer = audioBuffer instanceof ArrayBuffer 
    ? Buffer.from(audioBuffer) 
    : audioBuffer

  const deepgram = getDeepgramClient()
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    buffer,
    {
      model: "nova-2",
      language: "en",
      smart_format: true,
      punctuate: true,
      paragraphs: true,
      diarize: false,
      filler_words: true,
    }
  )

  if (error) {
    throw new Error(`Deepgram error: ${error.message}`)
  }

  const alternative = result?.results?.channels[0]?.alternatives[0]
  const transcript = alternative?.transcript || ""
  const confidence = alternative?.confidence || 0

  return {
    transcript,
    confidence,
    duration: result?.metadata?.duration,
  }
}

// ============================================
// GEMINI PROVIDER (Transcription + Analysis)
// ============================================
async function transcribeWithGemini(
  audioBuffer: Buffer | ArrayBuffer,
  options?: {
    analyzeResponse?: boolean
    roleContext?: string
  }
): Promise<TranscriptionResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  
  // Use the native audio model
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-preview-native-audio-dialog"
  })

  // Convert buffer to base64
  const buffer = audioBuffer instanceof ArrayBuffer 
    ? Buffer.from(audioBuffer) 
    : audioBuffer
  const base64Audio = buffer.toString("base64")

  // Build the prompt based on options
  const basePrompt = options?.analyzeResponse
    ? `Listen to this interview response and provide:
1. An accurate transcription of what was said
2. Analysis of the response quality

${options.roleContext ? `Context: This is for a ${options.roleContext} position.` : ''}

Respond in this JSON format:
{
  "transcript": "The exact words spoken...",
  "analysis": {
    "clarity": 8,
    "confidence": 7,
    "tone": "professional and engaged",
    "fillerWords": 3,
    "suggestions": ["Be more specific about...", "Consider adding..."]
  }
}`
    : `Transcribe this audio accurately. Include all spoken words, filler words (um, uh, like), and natural pauses. Respond with ONLY the transcription text, no additional formatting.`

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio,
        },
      },
      { text: basePrompt },
    ])

    const response = await result.response
    const text = response.text()

    // If we requested analysis, parse the JSON
    if (options?.analyzeResponse) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return {
            transcript: parsed.transcript,
            analysis: parsed.analysis,
          }
        }
      } catch {
        // Fall back to treating the whole response as transcript
      }
    }

    return {
      transcript: text.trim(),
    }
  } catch (error) {
    console.error("Gemini audio error:", error)
    throw new Error("Failed to transcribe with Gemini")
  }
}

// ============================================
// FALLBACK: Gemini 2.5 Flash (non-audio model)
// Uses standard Gemini when native audio isn't available
// ============================================
async function transcribeWithGeminiFallback(
  audioBuffer: Buffer | ArrayBuffer
): Promise<TranscriptionResult> {
  // For now, if native audio fails, we can try the standard model
  // which can process audio via the File API
  console.warn("[Transcription] Gemini native audio failed, consider using Deepgram")
  throw new Error("Gemini native audio not available, please use Deepgram")
}

// ============================================
// MAIN EXPORT: Auto-routes to active provider
// ============================================
export async function transcribeAudio(
  audioBuffer: Buffer | ArrayBuffer,
  options?: {
    provider?: TranscriptionProvider
    analyzeResponse?: boolean
    roleContext?: string
  }
): Promise<TranscriptionResult> {
  const provider = options?.provider || ACTIVE_PROVIDER
  console.log(`[Transcription] Using provider: ${provider}`)

  try {
    switch (provider) {
      case "gemini":
        return await transcribeWithGemini(audioBuffer, {
          analyzeResponse: options?.analyzeResponse,
          roleContext: options?.roleContext,
        })
      
      case "deepgram":
      default:
        return await transcribeWithDeepgram(audioBuffer)
    }
  } catch (error) {
    console.error(`[Transcription] ${provider} failed:`, error)
    
    // Auto-fallback: If Gemini fails, try Deepgram
    if (provider === "gemini" && process.env.DEEPGRAM_API_KEY) {
      console.log("[Transcription] Falling back to Deepgram...")
      return await transcribeWithDeepgram(audioBuffer)
    }
    
    throw error
  }
}

// ============================================
// COMBINED: Transcribe + Analyze in one call
// Uses Gemini for rich analysis
// ============================================
export async function transcribeAndAnalyze(
  audioBuffer: Buffer | ArrayBuffer,
  roleContext: string
): Promise<TranscriptionResult> {
  // Prefer Gemini for combined transcription + analysis
  if (process.env.GEMINI_API_KEY) {
    try {
      return await transcribeWithGemini(audioBuffer, {
        analyzeResponse: true,
        roleContext,
      })
    } catch (error) {
      console.error("[Transcription] Gemini analysis failed:", error)
    }
  }

  // Fallback to Deepgram (transcription only)
  return await transcribeWithDeepgram(audioBuffer)
}

// ============================================
// UTILITY EXPORTS
// ============================================
export function getActiveTranscriptionProvider(): TranscriptionProvider {
  return ACTIVE_PROVIDER
}

export function isTranscriptionConfigured(): boolean {
  switch (ACTIVE_PROVIDER) {
    case "deepgram":
      return !!process.env.DEEPGRAM_API_KEY
    case "gemini":
      return !!process.env.GEMINI_API_KEY
    default:
      return false
  }
}

export function getAvailableProviders(): TranscriptionProvider[] {
  const providers: TranscriptionProvider[] = []
  if (process.env.DEEPGRAM_API_KEY) providers.push("deepgram")
  if (process.env.GEMINI_API_KEY) providers.push("gemini")
  return providers
}

