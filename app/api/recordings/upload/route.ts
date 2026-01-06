// API Route: Upload audio recording to Vercel Blob
import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File | null
    const interviewId = formData.get("interviewId") as string
    const questionNumber = parseInt(formData.get("questionNumber") as string)

    if (!audioFile || !interviewId || isNaN(questionNumber)) {
      return NextResponse.json(
        { error: "Missing required fields: audio, interviewId, questionNumber" },
        { status: 400 }
      )
    }

    // Verify the interview belongs to the user
    const interview = await db.interview.findFirst({
      where: {
        id: interviewId,
        userId: session.user.id,
      },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      )
    }

    // Upload to Vercel Blob
    const filename = `recordings/${session.user.id}/${interviewId}/q${questionNumber}-${Date.now()}.webm`
    
    const blob = await put(filename, audioFile, {
      access: "public",
      contentType: audioFile.type || "audio/webm",
    })

    // Update the interview question with the audio URL
    await db.interviewQuestion.updateMany({
      where: {
        interviewId,
        questionNumber,
      },
      data: {
        audioUrl: blob.url,
        status: "recorded",
        recordedAt: new Date(),
      },
    })

    // Update interview answered count
    await db.interview.update({
      where: { id: interviewId },
      data: {
        answeredCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: "Audio uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading recording:", error)
    return NextResponse.json(
      { error: "Failed to upload recording" },
      { status: 500 }
    )
  }
}

