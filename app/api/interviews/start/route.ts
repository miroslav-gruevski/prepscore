import { NextRequest, NextResponse } from 'next/server'
import { generateInterviewQuestions } from '@/lib/question-generator'
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from '@/lib/rate-limit'
import { MAX_ROLE_DESCRIPTION_LENGTH, MIN_ROLE_DESCRIPTION_LENGTH, PERSONAS } from '@/lib/constants'

// POST /api/interviews/start
// Creates a new interview with 5 generated questions
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier, 20, 60) // 20 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait before starting another interview.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()
    const { roleDescription, persona } = body

    // Input validation
    if (!roleDescription || !persona) {
      return NextResponse.json(
        { error: 'Role description and persona are required' },
        { status: 400 }
      )
    }

    // Validate role description length
    if (typeof roleDescription !== 'string' || 
        roleDescription.length < MIN_ROLE_DESCRIPTION_LENGTH || 
        roleDescription.length > MAX_ROLE_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Role description must be between ${MIN_ROLE_DESCRIPTION_LENGTH} and ${MAX_ROLE_DESCRIPTION_LENGTH} characters` },
        { status: 400 }
      )
    }

    // Validate persona
    if (!PERSONAS.includes(persona)) {
      return NextResponse.json(
        { error: `Invalid persona. Must be one of: ${PERSONAS.join(', ')}` },
        { status: 400 }
      )
    }

    // Sanitize input (basic XSS prevention)
    const sanitizedRole = roleDescription
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim()

    // Generate 5 questions based on role + persona
    const questions = generateInterviewQuestions(sanitizedRole, persona)

    // Create interview ID (in production, save to database)
    const interviewId = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In demo mode, we'll store in session storage on client
    // In production, you would save to database here:
    /*
    const interview = await prisma.interview.create({
      data: {
        id: interviewId,
        userId: session.user.id,
        roleDescription: sanitizedRole,
        persona,
        status: 'in_progress',
        questions: {
          create: questions.map(q => ({
            questionNumber: q.questionNumber,
            questionType: q.questionType,
            questionText: q.questionText,
            status: 'pending',
          }))
        }
      },
      include: { questions: true }
    })
    */

    // Return with rate limit headers
    return NextResponse.json(
      {
        success: true,
        interviewId,
        roleDescription: sanitizedRole,
        persona,
        questions,
      },
      {
        headers: getRateLimitHeaders(rateLimitResult)
      }
    )
  } catch (error) {
    console.error('Error starting interview:', error)
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    )
  }
}

