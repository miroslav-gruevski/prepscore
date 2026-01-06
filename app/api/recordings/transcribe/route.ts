// API Route: Transcribe audio recording using Deepgram
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { transcribeAudio } from "@/lib/transcription-provider"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { interviewId, questionNumber, audioUrl } = body

    if (!interviewId || !questionNumber) {
      return NextResponse.json(
        { error: "Missing required fields: interviewId, questionNumber" },
        { status: 400 }
      )
    }

    // Verify the interview belongs to the user
    const interview = await db.interview.findFirst({
      where: {
        id: interviewId,
        userId: session.user.id,
      },
      include: {
        questions: {
          where: { questionNumber },
        },
      },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      )
    }

    const question = interview.questions[0]
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    // Get audio URL from question or from request
    const audioSource = audioUrl || question.audioUrl
    if (!audioSource) {
      return NextResponse.json(
        { error: "No audio recording found for this question" },
        { status: 400 }
      )
    }

    // Fetch the audio file
    const audioResponse = await fetch(audioSource)
    if (!audioResponse.ok) {
      throw new Error("Failed to fetch audio file")
    }

    const audioBuffer = await audioResponse.arrayBuffer()

    // Transcribe using configured provider (Deepgram by default)
    const result = await transcribeAudio(Buffer.from(audioBuffer), {
      provider: "deepgram",
      roleContext: interview.roleDescription,
    })

    // Update the question with transcript
    await db.interviewQuestion.update({
      where: { id: question.id },
      data: {
        transcript: result.transcript,
        status: "transcribed",
      },
    })

    return NextResponse.json({
      success: true,
      transcript: result.transcript,
      confidence: result.confidence,
      duration: result.duration,
    })
  } catch (error) {
    console.error("Error transcribing recording:", error)
    return NextResponse.json(
      { error: "Failed to transcribe recording" },
      { status: 500 }
    )
  }
}

