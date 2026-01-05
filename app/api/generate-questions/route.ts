import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { role, category } = await request.json()

    if (!role || !category) {
      return NextResponse.json(
        { error: "Role and category are required" },
        { status: 400 }
      )
    }

    // Use Gemini to generate custom questions
    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      console.log("No Gemini API key, using fallback")
      return NextResponse.json({ questions: [] })
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const categoryDescriptions: Record<string, string> = {
      technical: "technical coding, architecture, and implementation questions",
      behavioral: "behavioral questions about past experiences and soft skills",
      system_design: "system design and architecture questions for building scalable systems",
      leadership: "leadership, team management, and technical decision-making questions",
      product: "product thinking, prioritization, and user-focused questions",
    }

    const prompt = `You are an expert technical interviewer. Generate 3 unique, specific, and relevant ${categoryDescriptions[category] || "interview questions"} for a candidate applying for the role: "${role}".

Requirements:
- Questions should be highly specific to the "${role}" role
- Focus on ${categoryDescriptions[category]}
- Make them realistic and commonly asked in actual interviews
- Vary the difficulty and scope
- Each question should be clear and concise (1-2 sentences)

Return ONLY a JSON array of 3 strings (questions), nothing else. Example format:
["Question 1 text here?", "Question 2 text here?", "Question 3 text here?"]`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the JSON response
    let questions: string[] = []
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      // If parsing fails, try to extract questions manually
      const lines = text.split('\n').filter(line => line.trim().length > 10)
      questions = lines.slice(0, 3).map(q => q.replace(/^[-*"'\d.)\s]+/, '').replace(/["']+$/, '').trim())
    }

    // Validate and clean questions
    questions = questions
      .filter((q: string) => q && q.length > 10 && q.length < 300)
      .slice(0, 3)

    if (questions.length === 0) {
      return NextResponse.json({ questions: [] })
    }

    return NextResponse.json({ questions })

  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json(
      { error: "Failed to generate questions", questions: [] },
      { status: 500 }
    )
  }
}

