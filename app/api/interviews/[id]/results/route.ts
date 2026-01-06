// API Route: Get interview results with transcripts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await context.params

    // Fetch interview with questions and analysis
    const interview = await db.interview.findFirst({
      where: {
        id,
        // If logged in, verify ownership. If demo mode, allow access
        ...(session?.user?.id ? { userId: session.user.id } : {}),
      },
      include: {
        questions: {
          orderBy: { questionNumber: "asc" },
        },
        analysis: true,
        signals: true,
      },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      )
    }

    // Transform for frontend
    const result = {
      id: interview.id,
      roleDescription: interview.roleDescription,
      persona: interview.persona,
      status: interview.status,
      createdAt: interview.createdAt.toISOString(),
      completedAt: interview.completedAt?.toISOString(),
      analyzedAt: interview.analyzedAt?.toISOString(),
      
      questions: interview.questions.map((q) => ({
        questionNumber: q.questionNumber,
        questionType: q.questionType,
        questionText: q.questionText,
        transcript: q.transcript,
        audioUrl: q.audioUrl,
        duration: q.duration,
        score: q.score,
        feedback: q.feedback,
        strengths: q.strengths,
        improvements: q.improvements,
        status: q.status,
      })),
      
      analysis: interview.analysis ? {
        overallScore: interview.analysis.overallScore,
        verdict: interview.analysis.verdict,
        overallFeedback: interview.analysis.overallFeedback,
        topStrengths: interview.analysis.topStrengths,
        topImprovements: interview.analysis.topImprovements,
        actionItems: interview.analysis.actionItems,
        skills: {
          communicationClarity: interview.analysis.communicationClarity,
          conciseness: interview.analysis.conciseness,
          structure: interview.analysis.structure,
          confidence: interview.analysis.confidence,
          relevance: interview.analysis.relevance,
          technicalDepth: interview.analysis.technicalDepth,
          problemFraming: interview.analysis.problemFraming,
          leadership: interview.analysis.leadership,
        },
      } : null,
      
      signals: interview.signals.map((s) => ({
        name: s.name,
        score: s.score,
        definition: s.definition,
      })),
    }

    return NextResponse.json({
      success: true,
      interview: result,
    })
  } catch (error) {
    console.error("Error fetching interview results:", error)
    return NextResponse.json(
      { error: "Failed to fetch interview results" },
      { status: 500 }
    )
  }
}

