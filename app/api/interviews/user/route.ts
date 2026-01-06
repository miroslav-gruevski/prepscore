// API Route: Get user's interviews from database
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's interviews with related data
    const interviews = await db.interview.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        questions: {
          orderBy: { questionNumber: "asc" },
        },
        signals: true,
        analysis: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data for frontend
    const transformedInterviews = interviews.map((interview) => ({
      id: interview.id,
      roleDescription: interview.roleDescription,
      persona: interview.persona,
      questionType: interview.questionType || "mixed",
      focusCategory: interview.questions[0]?.questionType || "mixed",
      status: interview.status,
      createdAt: interview.createdAt.toISOString(),
      analyzedAt: interview.analyzedAt?.toISOString() || null,
      overallScore: interview.overallScore || interview.analysis?.overallScore || null,
      questionsCount: interview.questionsCount,
      answeredCount: interview.answeredCount,
      signalsDetected: interview.signals.map((s) => ({
        id: s.id,
        name: s.name,
        score: s.score,
      })),
      questions: interview.questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        questionType: q.questionType,
        questionText: q.questionText,
        transcript: q.transcript,
        score: q.score,
        status: q.status,
      })),
    }))

    return NextResponse.json({
      success: true,
      interviews: transformedInterviews,
    })
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    )
  }
}

