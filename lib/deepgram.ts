// Deepgram API Wrapper
import { createClient } from "@deepgram/sdk"

// Lazy initialization to prevent build-time errors
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

export async function transcribeAudio(audioBuffer: Buffer | ArrayBuffer) {
  try {
    // Convert ArrayBuffer to Buffer if needed
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
      }
    )

    if (error) {
      throw new Error(`Deepgram error: ${error.message}`)
    }

    const transcript =
      result?.results?.channels[0]?.alternatives[0]?.transcript || ""

    return transcript
  } catch (error) {
    console.error("Transcription error:", error)
    throw new Error("Failed to transcribe audio")
  }
}

