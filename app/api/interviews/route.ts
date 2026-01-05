// API Routes for Interview CRUD operations
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { addInterview, getAllInterviews } from "@/lib/mock-storage"

// POST: Create a new interview
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { roleDescription, persona, question, questionType } = body

    if (!roleDescription || !persona || !question || !questionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create mock interview (no database needed)
    const interview = {
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.email,
      roleDescription,
      persona,
      question,
      questionType,
      duration: 0,
      videoUrl: null,
      audioUrl: null,
      transcript: null,
      strengths: [],
      improvements: [],
      signalsDetected: [],
      createdAt: new Date().toISOString(),
      analyzedAt: null,
    }

    // Store in memory
    addInterview(interview)

    console.log(`[API] Created interview: ${interview.id}`, {
      question: interview.question,
      questionType: interview.questionType
    })

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Create interview error:", error)
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    )
  }
}

// GET: List user's interviews
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return mock interviews for this user
    const allInterviews = getAllInterviews()
    const userInterviews = allInterviews
      .filter(i => i.userId === session.user.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)

    return NextResponse.json(userInterviews)
  } catch (error) {
    console.error("Fetch interviews error:", error)
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    )
  }
}

