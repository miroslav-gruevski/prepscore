// Claude API Wrapper
import Anthropic from "@anthropic-ai/sdk"

// Lazy initialization to prevent build-time errors
let anthropicClient: Anthropic | null = null

function getAnthropicClient() {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured")
    }
    anthropicClient = new Anthropic({ apiKey })
  }
  return anthropicClient
}

export async function analyzeInterview(params: {
  transcript: string
  roleDescription: string
  persona: string
  question: string
  signals: Array<{ name: string; definition: string }>
}) {
  const { transcript, roleDescription, persona, question, signals } = params

  const signalList = signals
    .map((s) => `- ${s.name}: ${s.definition}`)
    .join("\n")

  const prompt = `You are an expert interview coach analyzing a candidate's response to an interview question.

Role Target: ${roleDescription}
Question: ${question}
Interviewer Persona: ${persona}

Candidate's Response:
"${transcript}"

Evaluate the response on these hiring signals for this role:
${signalList}

Please provide:

1. SIGNALS DETECTED (score each 0-10):
For each signal, provide: name, score, brief reason

2. STRENGTHS (3-4 specific observations):
- What did they do well?
- Why does this matter?

3. AREAS TO IMPROVE (3-4 specific gaps):
- What signals were missing?
- How to address this?

4. NEXT SESSION RECOMMENDATION:
Suggest which persona to practice with next based on their weak areas.

Format as JSON:
{
  "signals": [{"name": "", "score": 0, "reason": ""}],
  "strengths": [""],
  "improvements": [""],
  "nextRecommendation": ""
}`

  const anthropic = getAnthropicClient()
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude")
  }

  // Extract JSON from the response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Claude response")
  }

  return JSON.parse(jsonMatch[0])
}

