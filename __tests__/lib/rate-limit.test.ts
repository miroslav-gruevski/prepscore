import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from '@/lib/rate-limit'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset rate limit store between tests
    vi.useFakeTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow requests under limit', () => {
      const identifier = `test-user-${Date.now()}`
      
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, 10, 60)
        expect(result.success).toBe(true)
        expect(result.remaining).toBe(10 - (i + 1))
      }
    })

    it('should block requests over limit', () => {
      const identifier = `test-user-blocked-${Date.now()}`
      
      // Exhaust the limit
      for (let i = 0; i < 10; i++) {
        checkRateLimit(identifier, 10, 60)
      }
      
      // 11th request should fail
      const result = checkRateLimit(identifier, 10, 60)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const identifier = `test-user-reset-${Date.now()}`
      
      // Use up the limit
      for (let i = 0; i < 10; i++) {
        checkRateLimit(identifier, 10, 60)
      }
      
      // Advance time past the window
      vi.advanceTimersByTime(61000)
      
      // Should be allowed again
      const result = checkRateLimit(identifier, 10, 60)
      expect(result.success).toBe(true)
    })
  })

  describe('getIdentifier', () => {
    it('should prefer user ID over IP', () => {
      const request = new Request('https://example.com', {
        headers: { 'x-forwarded-for': '1.2.3.4' }
      })
      
      const identifier = getIdentifier(request, 'user-123')
      expect(identifier).toBe('user:user-123')
    })

    it('should use x-forwarded-for header', () => {
      const request = new Request('https://example.com', {
        headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }
      })
      
      const identifier = getIdentifier(request)
      expect(identifier).toBe('ip:1.2.3.4')
    })

    it('should use x-real-ip as fallback', () => {
      const request = new Request('https://example.com', {
        headers: { 'x-real-ip': '9.8.7.6' }
      })
      
      const identifier = getIdentifier(request)
      expect(identifier).toBe('ip:9.8.7.6')
    })

    it('should return unknown for no IP headers', () => {
      const request = new Request('https://example.com')
      const identifier = getIdentifier(request)
      expect(identifier).toBe('ip:unknown')
    })
  })

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        success: true,
        limit: 10,
        remaining: 5,
        reset: Date.now() + 60000,
      }
      
      const headers = getRateLimitHeaders(result)
      
      expect(headers['X-RateLimit-Limit']).toBe('10')
      expect(headers['X-RateLimit-Remaining']).toBe('5')
      expect(headers['X-RateLimit-Reset']).toBeTruthy()
    })
  })
})

