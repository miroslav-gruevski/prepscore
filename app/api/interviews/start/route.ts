import { NextRequest, NextResponse } from 'next/server'
import { generateInterviewQuestions } from '@/lib/question-generator'
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from '@/lib/rate-limit'
import { MAX_ROLE_DESCRIPTION_LENGTH, MIN_ROLE_DESCRIPTION_LENGTH, PERSONAS, FOCUS_CATEGORIES } from '@/lib/constants'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/interviews/start
// Creates a new interview with 5 generated questions
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth()
    
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
    const { roleDescription, persona, focusCategory } = body

    // Input validation
    if (!roleDescription || !persona || !focusCategory) {
      return NextResponse.json(
        { error: 'Role description, persona, and focus category are required' },
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

    // Validate focus category
    if (!FOCUS_CATEGORIES.includes(focusCategory)) {
      return NextResponse.json(
        { error: `Invalid focus category. Must be one of: ${FOCUS_CATEGORIES.join(', ')}` },
        { status: 400 }
      )
    }

    // Sanitize input (basic XSS prevention)
    const sanitizedRole = roleDescription
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim()

    // Generate 5 questions based on role + persona + focus category
    const questions = generateInterviewQuestions(sanitizedRole, persona, focusCategory)

    // If user is authenticated, save to database
    if (session?.user?.id) {
      try {
        const interview = await db.interview.create({
          data: {
            userId: session.user.id,
            roleDescription: sanitizedRole,
            persona,
            status: 'in_progress',
            questionsCount: questions.length,
            startedAt: new Date(),
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

        return NextResponse.json(
          {
            success: true,
            interviewId: interview.id,
            roleDescription: sanitizedRole,
            persona,
            focusCategory,
            questions: interview.questions.map(q => ({
              questionNumber: q.questionNumber,
              questionType: q.questionType,
              questionText: q.questionText,
            })),
            savedToDatabase: true,
          },
          {
            headers: getRateLimitHeaders(rateLimitResult)
          }
        )
      } catch (dbError) {
        console.error('Database error, falling back to demo mode:', dbError)
        // Fall through to demo mode if DB fails
      }
    }

    // Demo mode: generate ID without saving to database
    const interviewId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json(
      {
        success: true,
        interviewId,
        roleDescription: sanitizedRole,
        persona,
        focusCategory,
        questions,
        savedToDatabase: false,
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
