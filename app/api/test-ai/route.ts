// Test AI Analysis Endpoint
import { analyzeInterview, getActiveProvider, isProviderConfigured } from "@/lib/llm-provider"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log(`[TEST] Testing AI provider: ${getActiveProvider()}`)
    console.log(`[TEST] Provider configured: ${isProviderConfigured()}`)

    if (!isProviderConfigured()) {
      return NextResponse.json({
        error: `Provider '${getActiveProvider()}' not configured`,
        configured: false,
      }, { status: 503 })
    }

    // Sample interview data
    const result = await analyzeInterview({
      transcript: "I would approach this problem by first understanding the requirements. For a rate limiter, I'd consider using a token bucket algorithm because it provides smooth rate limiting and allows for burst traffic. I'd implement it with Redis for distributed systems, storing tokens per user. The key considerations are: atomicity of operations, handling edge cases like clock skew, and ensuring low latency. I'd also add monitoring to track rate limit hits and adjust thresholds based on actual usage patterns.",
      roleDescription: "Senior Backend Engineer at a Scale-up",
      persona: "technical",
      question: "How would you design a rate limiter for an API?",
      signals: [
        { name: "Problem Framing", definition: "Ability to break down complex problems into clear components" },
        { name: "Technical Depth", definition: "Understanding of technical concepts and ability to explain them" },
        { name: "Trade-off Discussion", definition: "Awareness of pros/cons and ability to justify decisions" },
        { name: "System Design Thinking", definition: "Consideration of scalability, monitoring, and edge cases" },
      ],
    })

    return NextResponse.json({
      provider: getActiveProvider(),
      configured: true,
      analysis: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[TEST] AI analysis error:", error)
    return NextResponse.json({
      error: error.message,
      provider: getActiveProvider(),
      configured: isProviderConfigured(),
    }, { status: 500 })
  }
}

