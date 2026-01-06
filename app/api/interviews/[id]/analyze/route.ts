// API Route: Generate AI analysis from interview transcripts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await context.params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI provider not configured" },
        { status: 503 }
      )
    }

    // Get interview with questions
    const interview = await db.interview.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        questions: {
          orderBy: { questionNumber: "asc" },
        },
      },
    })

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // Check if there are transcripts to analyze
    const questionsWithTranscripts = interview.questions.filter(q => q.transcript)
    
    if (questionsWithTranscripts.length === 0) {
      return NextResponse.json(
        { error: "No transcripts available. Please complete recording first." },
        { status: 400 }
      )
    }

    // Build the analysis prompt
    const questionsForAnalysis = questionsWithTranscripts.map(q => ({
      number: q.questionNumber,
      type: q.questionType,
      question: q.questionText,
      response: q.transcript,
    }))

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert interview coach analyzing a candidate's interview responses.

Role: ${interview.roleDescription}
Interviewer Style: ${interview.persona}

The candidate answered the following questions:

${questionsForAnalysis.map(q => `
Question ${q.number} (${q.type}): "${q.question}"
Response: "${q.response}"
`).join('\n---\n')}

Please analyze ALL responses and provide comprehensive feedback. Respond ONLY in this exact JSON format:

{
  "overallScore": <number 1-10>,
  "verdict": "<Strong Hire|Hire|Lean Hire|Lean No Hire|No Hire>",
  "overallFeedback": "<2-3 sentences summarizing overall performance>",
  "skills": {
    "communicationClarity": <number 1-10>,
    "technicalDepth": <number 1-10>,
    "problemFraming": <number 1-10>,
    "structure": <number 1-10>,
    "confidence": <number 1-10>,
    "conciseness": <number 1-10>,
    "relevance": <number 1-10>,
    "leadership": <number 1-10>
  },
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "actionItems": ["<action 1>", "<action 2>", "<action 3>", "<action 4>"],
  "questionFeedback": [
    {
      "questionNumber": <number>,
      "score": <number 1-10>,
      "strengths": ["<what they did well>", "<another strength>"],
      "improvements": ["<area to improve>", "<another improvement>"],
      "keyTakeaway": "<one sentence summary of feedback>"
    }
  ]
}

Be specific and actionable. Reference actual content from their responses.`

    console.log(`[Analyze] Generating AI analysis for interview ${id}...`)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("Failed to parse AI response:", text)
      throw new Error("Could not parse JSON from AI response")
    }

    const analysis = JSON.parse(jsonMatch[0])
    console.log(`[Analyze] AI analysis complete. Score: ${analysis.overallScore}/10`)

    // Save analysis to database
    await db.interviewAnalysis.upsert({
      where: { interviewId: id },
      create: {
        interviewId: id,
        overallScore: analysis.overallScore,
        verdict: analysis.verdict,
        overallFeedback: analysis.overallFeedback,
        communicationClarity: analysis.skills?.communicationClarity || 0,
        technicalDepth: analysis.skills?.technicalDepth || 0,
        problemFraming: analysis.skills?.problemFraming || 0,
        structure: analysis.skills?.structure || 0,
        confidence: analysis.skills?.confidence || 0,
        conciseness: analysis.skills?.conciseness || 0,
        relevance: analysis.skills?.relevance || 0,
        leadership: analysis.skills?.leadership || 0,
        topStrengths: analysis.topStrengths || [],
        topImprovements: analysis.topImprovements || [],
        actionItems: analysis.actionItems || [],
      },
      update: {
        overallScore: analysis.overallScore,
        verdict: analysis.verdict,
        overallFeedback: analysis.overallFeedback,
        communicationClarity: analysis.skills?.communicationClarity || 0,
        technicalDepth: analysis.skills?.technicalDepth || 0,
        problemFraming: analysis.skills?.problemFraming || 0,
        structure: analysis.skills?.structure || 0,
        confidence: analysis.skills?.confidence || 0,
        conciseness: analysis.skills?.conciseness || 0,
        relevance: analysis.skills?.relevance || 0,
        leadership: analysis.skills?.leadership || 0,
        topStrengths: analysis.topStrengths || [],
        topImprovements: analysis.topImprovements || [],
        actionItems: analysis.actionItems || [],
      },
    })

    // Update question-level feedback
    for (const qFeedback of analysis.questionFeedback || []) {
      const question = interview.questions.find(
        q => q.questionNumber === qFeedback.questionNumber
      )
      if (question) {
        await db.interviewQuestion.update({
          where: { id: question.id },
          data: {
            score: qFeedback.score,
            strengths: qFeedback.strengths || [],
            improvements: qFeedback.improvements || [],
            feedback: qFeedback.keyTakeaway,
            status: "analyzed",
          },
        })
      }
    }

    // Update interview status
    await db.interview.update({
      where: { id },
      data: {
        status: "analyzed",
        analyzedAt: new Date(),
        overallScore: analysis.overallScore,
      },
    })

    return NextResponse.json({
      success: true,
      analysis: {
        overallScore: analysis.overallScore,
        verdict: analysis.verdict,
        overallFeedback: analysis.overallFeedback,
        skills: analysis.skills,
        topStrengths: analysis.topStrengths,
        topImprovements: analysis.topImprovements,
        actionItems: analysis.actionItems,
        questionFeedback: analysis.questionFeedback,
      },
    })
  } catch (error) {
    console.error("Error analyzing interview:", error)
    return NextResponse.json(
      { error: "Failed to analyze interview" },
      { status: 500 }
    )
  }
}
