import { describe, it, expect } from 'vitest'
import {
  MAX_QUESTIONS,
  MAX_RECORDING_SECONDS,
  QUESTION_TYPES,
  PERSONAS,
  PERSONA_INFO,
  ROUTES,
} from '@/lib/constants'

describe('Constants', () => {
  describe('Interview Settings', () => {
    it('should have MAX_QUESTIONS as 5', () => {
      expect(MAX_QUESTIONS).toBe(5)
    })

    it('should have reasonable recording time limit', () => {
      expect(MAX_RECORDING_SECONDS).toBeGreaterThan(60)
      expect(MAX_RECORDING_SECONDS).toBeLessThanOrEqual(600)
    })
  })

  describe('Question Types', () => {
    it('should include essential question types', () => {
      expect(QUESTION_TYPES).toContain('technical')
      expect(QUESTION_TYPES).toContain('behavioral')
      expect(QUESTION_TYPES).toContain('system_design')
    })

    it('should be a readonly tuple', () => {
      expect(QUESTION_TYPES.length).toBeGreaterThan(0)
    })
  })

  describe('Personas', () => {
    it('should have 4 personas', () => {
      expect(PERSONAS).toHaveLength(4)
    })

    it('should include all persona types', () => {
      expect(PERSONAS).toContain('technical')
      expect(PERSONAS).toContain('skeptic')
      expect(PERSONAS).toContain('friendly')
      expect(PERSONAS).toContain('rushed')
    })

    it('should have info for each persona', () => {
      PERSONAS.forEach(persona => {
        expect(PERSONA_INFO[persona]).toBeDefined()
        expect(PERSONA_INFO[persona].label).toBeTruthy()
        expect(PERSONA_INFO[persona].emoji).toBeTruthy()
        expect(PERSONA_INFO[persona].description).toBeTruthy()
      })
    })
  })

  describe('Routes', () => {
    it('should have essential routes', () => {
      expect(ROUTES.HOME).toBe('/')
      expect(ROUTES.DASHBOARD).toBe('/dashboard')
      expect(ROUTES.NEW_INTERVIEW).toBe('/interview/new')
    })

    it('should generate dynamic routes', () => {
      expect(ROUTES.INTERVIEW_SESSION('123')).toBe('/interview/session/123')
      expect(ROUTES.INTERVIEW_RESULTS('abc')).toBe('/interview/results/abc')
    })
  })
})

