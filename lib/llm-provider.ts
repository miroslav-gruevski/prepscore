// Flexible LLM Provider System
// Supports: Gemini, Claude, Minimax, DeepSeek, Local models, etc.

import { GoogleGenerativeAI } from "@google/generative-ai"

export type LLMProvider = "gemini" | "claude" | "minimax" | "deepseek" | "local" | "ollama"

interface AnalysisRequest {
  transcript: string
  roleDescription: string
  persona: string
  question: string
  signals: Array<{ name: string; definition: string }>
}

interface AnalysisResponse {
  signals: Array<{
    name: string
    score: number
    reason: string
  }>
  strengths: string[]
  improvements: string[]
  nextRecommendation: string
}

// Configure which LLM to use (set in environment)
const ACTIVE_PROVIDER: LLMProvider = (process.env.LLM_PROVIDER as LLMProvider) || "gemini"

// ============================================
// GEMINI PROVIDER (Google)
// ============================================
async function analyzeWithGemini(params: AnalysisRequest): Promise<AnalysisResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set in environment variables")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  // Use Gemini 2.5 Flash (fastest, free tier)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

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

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Gemini response")
  }

  return JSON.parse(jsonMatch[0])
}

// ============================================
// CLAUDE PROVIDER (Anthropic)
// ============================================
async function analyzeWithClaude(params: AnalysisRequest): Promise<AnalysisResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const { transcript, roleDescription, persona, question, signals } = params

  const signalList = signals
    .map((s) => `- ${s.name}: ${s.definition}`)
    .join("\n")

  const prompt = `You are an expert interview coach analyzing a candidate's response.

Role Target: ${roleDescription}
Question: ${question}
Interviewer Persona: ${persona}

Candidate's Response:
"${transcript}"

Evaluate on these signals:
${signalList}

Respond with JSON:
{
  "signals": [{"name": "", "score": 0, "reason": ""}],
  "strengths": [""],
  "improvements": [""],
  "nextRecommendation": ""
}`

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude")
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Claude response")
  }

  return JSON.parse(jsonMatch[0])
}

// ============================================
// MINIMAX PROVIDER (Chinese LLM)
// ============================================
async function analyzeWithMinimax(params: AnalysisRequest): Promise<AnalysisResponse> {
  // Minimax API implementation
  // Documentation: https://www.minimaxi.com/document/guides/chat-model/V2
  
  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_v2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "abab6.5-chat",
      messages: [
        {
          role: "user",
          content: buildPrompt(params),
        },
      ],
    }),
  })

  const data = await response.json()
  return parseResponse(data.choices[0].message.content)
}

// ============================================
// DEEPSEEK PROVIDER (Chinese LLM)
// ============================================
async function analyzeWithDeepseek(params: AnalysisRequest): Promise<AnalysisResponse> {
  // DeepSeek API (OpenAI-compatible)
  // Documentation: https://platform.deepseek.com/api-docs/
  
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: buildPrompt(params),
        },
      ],
    }),
  })

  const data = await response.json()
  return parseResponse(data.choices[0].message.content)
}

// ============================================
// LOCAL/OLLAMA PROVIDER (Self-hosted)
// ============================================
async function analyzeWithLocal(params: AnalysisRequest): Promise<AnalysisResponse> {
  // Ollama local models
  // Default endpoint: http://localhost:11434
  
  const endpoint = process.env.OLLAMA_ENDPOINT || "http://localhost:11434"
  const model = process.env.OLLAMA_MODEL || "llama3"

  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(params),
      stream: false,
    }),
  })

  const data = await response.json()
  return parseResponse(data.response)
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function buildPrompt(params: AnalysisRequest): string {
  const { transcript, roleDescription, persona, question, signals } = params

  const signalList = signals
    .map((s) => `- ${s.name}: ${s.definition}`)
    .join("\n")

  return `You are an expert interview coach analyzing a candidate's response.

Role Target: ${roleDescription}
Question: ${question}
Interviewer Persona: ${persona}

Candidate's Response:
"${transcript}"

Evaluate on these hiring signals:
${signalList}

Respond ONLY with valid JSON in this exact format:
{
  "signals": [{"name": "Signal Name", "score": 7, "reason": "Brief explanation"}],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "nextRecommendation": "Which persona to try next"
}`
}

function parseResponse(text: string): AnalysisResponse {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from LLM response")
  }
  return JSON.parse(jsonMatch[0])
}

// ============================================
// MAIN EXPORT: Auto-routes to active provider
// ============================================
export async function analyzeInterview(
  params: AnalysisRequest
): Promise<AnalysisResponse> {
  console.log(`[LLM] Using provider: ${ACTIVE_PROVIDER}`)

  switch (ACTIVE_PROVIDER) {
    case "gemini":
      return analyzeWithGemini(params)
    
    case "claude":
      return analyzeWithClaude(params)
    
    case "minimax":
      return analyzeWithMinimax(params)
    
    case "deepseek":
      return analyzeWithDeepseek(params)
    
    case "local":
    case "ollama":
      return analyzeWithLocal(params)
    
    default:
      throw new Error(`Unsupported LLM provider: ${ACTIVE_PROVIDER}`)
  }
}

// Export provider info for debugging
export function getActiveProvider(): LLMProvider {
  return ACTIVE_PROVIDER
}

export function isProviderConfigured(): boolean {
  switch (ACTIVE_PROVIDER) {
    case "gemini":
      return !!process.env.GEMINI_API_KEY
    case "claude":
      return !!process.env.ANTHROPIC_API_KEY
    case "minimax":
      return !!process.env.MINIMAX_API_KEY
    case "deepseek":
      return !!process.env.DEEPSEEK_API_KEY
    case "local":
    case "ollama":
      return true // Assumes local server is running
    default:
      return false
  }
}

