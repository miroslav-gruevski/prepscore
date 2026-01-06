// Simple in-memory rate limiter for API routes
// For production, use Redis-based solution (e.g., @upstash/ratelimit)

import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_SECONDS } from './constants'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (for single-instance deployments)
// Replace with Redis for multi-instance deployments
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given identifier (usually IP or user ID)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = RATE_LIMIT_REQUESTS,
  windowSeconds: number = RATE_LIMIT_WINDOW_SECONDS
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const key = `ratelimit:${identifier}`

  let entry = rateLimitStore.get(key)

  // Create new entry if doesn't exist or expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment count
  entry.count++

  const remaining = Math.max(0, limit - entry.count)
  const success = entry.count <= limit

  return {
    success,
    limit,
    remaining,
    reset: entry.resetTime,
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString(),
  }
}

/**
 * Extract identifier from request (IP address or user ID)
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`
  }

  if (realIp) {
    return `ip:${realIp}`
  }

  return 'ip:unknown'
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 */
export function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options?: { limit?: number; windowSeconds?: number }
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const identifier = getIdentifier(request)
    const result = checkRateLimit(identifier, options?.limit, options?.windowSeconds)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(result),
          },
        }
      )
    }

    // Call original handler
    const response = await handler(request, ...args)

    // Add rate limit headers to response
    const headers = new Headers(response.headers)
    Object.entries(getRateLimitHeaders(result)).forEach(([key, value]) => {
      headers.set(key, value)
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

