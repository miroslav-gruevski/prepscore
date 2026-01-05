// API Routes for Individual Interview Operations
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { getInterview, updateInterview, deleteInterview as deleteInterviewFromStorage } from "@/lib/mock-storage"

// GET: Fetch a single interview
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find in mock storage
    const interview = getInterview(id)

    if (!interview || interview.userId !== session.user.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    console.log(`[API] Fetched interview: ${interview.id}`, {
      question: interview.question,
      questionType: interview.questionType
    })

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Fetch interview error:", error)
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 }
    )
  }
}

// PUT: Update interview with recording data
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { videoUrl, audioUrl, transcript, duration } = body

    // Find interview
    const interview = getInterview(id)
    
    if (!interview || interview.userId !== session.user.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Update interview
    const updated = updateInterview(id, {
      videoUrl,
      audioUrl,
      transcript,
      duration,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update interview error:", error)
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    )
  }
}

// DELETE: Delete an interview
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find interview
    const interview = getInterview(id)
    
    if (!interview || interview.userId !== session.user.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Delete interview
    deleteInterviewFromStorage(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete interview error:", error)
    return NextResponse.json(
      { error: "Failed to delete interview" },
      { status: 500 }
    )
  }
}

