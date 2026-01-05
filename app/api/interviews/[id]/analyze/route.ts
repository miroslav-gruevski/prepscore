// API Route for Interview Analysis with Flexible LLM Provider
import { auth } from "@/lib/auth"
import { analyzeInterview, getActiveProvider, isProviderConfigured } from "@/lib/llm-provider"
import { getSignalsForPersona } from "@/lib/signal-definitions"
import { NextResponse } from "next/server"
import { getInterview, updateInterview } from "@/lib/mock-storage"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if LLM is configured
    if (!isProviderConfigured()) {
      return NextResponse.json(
        { 
          error: `LLM provider '${getActiveProvider()}' not configured. Please set API key in .env.local` 
        },
        { status: 503 }
      )
    }

    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get interview from mock storage
    const interview = getInterview(id)

    if (!interview || interview.userId !== session.user.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (!interview.transcript) {
      return NextResponse.json(
        { error: "No transcript available. Please upload audio first." },
        { status: 400 }
      )
    }

    // Get signal definitions for the persona
    const signals = getSignalsForPersona(interview.persona)

    console.log(`[API] Analyzing with ${getActiveProvider()}...`)

    // Analyze with active LLM provider (Gemini, Claude, etc.)
    const analysis = await analyzeInterview({
      transcript: interview.transcript,
      roleDescription: interview.roleDescription,
      persona: interview.persona,
      question: interview.question,
      signals,
    })

    // Save results to mock storage
    const updated = updateInterview(id, {
      analyzedAt: new Date().toISOString(),
      signalsDetected: analysis.signals.map((s: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: s.name,
        score: s.score,
        definition: s.reason,
      })),
      strengths: analysis.strengths,
      improvements: analysis.improvements,
    })

    console.log(`[API] Analysis complete for interview: ${id}`)

    return NextResponse.json({
      ...updated,
      nextRecommendation: analysis.nextRecommendation,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze interview" },
      { status: 500 }
    )
  }
}

