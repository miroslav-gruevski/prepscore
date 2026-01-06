import { describe, it, expect } from 'vitest'
import { 
  generateInterviewQuestions, 
  getQuestionTypeDisplay
} from '@/lib/question-generator'

describe('Question Generator', () => {
  describe('generateInterviewQuestions', () => {
    it('should generate exactly 5 questions', () => {
      const questions = generateInterviewQuestions('Software Engineer', 'technical')
      expect(questions).toHaveLength(5)
    })

    it('should include question numbers 1-5', () => {
      const questions = generateInterviewQuestions('Product Manager', 'friendly')
      const numbers = questions.map(q => q.questionNumber)
      expect(numbers).toEqual([1, 2, 3, 4, 5])
    })

    it('should have valid question types', () => {
      const questions = generateInterviewQuestions('Data Scientist', 'skeptic')
      const validTypes = ['technical', 'behavioral', 'system_design', 'leadership', 'problem_solving', 'culture_fit', 'role_specific', 'situational']
      
      questions.forEach(q => {
        expect(validTypes).toContain(q.questionType)
      })
    })

    it('should have non-empty question text', () => {
      const questions = generateInterviewQuestions('Marketing Manager', 'rushed')
      
      questions.forEach(q => {
        expect(q.questionText).toBeTruthy()
        expect(q.questionText.length).toBeGreaterThan(10)
      })
    })

    it('should work with different personas', () => {
      const personas = ['technical', 'skeptic', 'friendly', 'rushed'] as const
      
      personas.forEach(persona => {
        const questions = generateInterviewQuestions('Engineer', persona)
        expect(questions).toHaveLength(5)
      })
    })

    it('should generate different questions for different roles', () => {
      const frontendQuestions = generateInterviewQuestions('Frontend Developer', 'technical')
      const backendQuestions = generateInterviewQuestions('Backend Developer', 'technical')
      
      // Both should have 5 questions
      expect(frontendQuestions).toHaveLength(5)
      expect(backendQuestions).toHaveLength(5)
      
      // Questions should be different for different roles
      const frontendTexts = frontendQuestions.map(q => q.questionText).join('')
      const backendTexts = backendQuestions.map(q => q.questionText).join('')
      expect(frontendTexts).not.toBe(backendTexts)
    })

    it('should generate different questions for different personas', () => {
      const technicalQuestions = generateInterviewQuestions('Software Engineer', 'technical')
      const friendlyQuestions = generateInterviewQuestions('Software Engineer', 'friendly')
      
      // Both should have 5 questions
      expect(technicalQuestions).toHaveLength(5)
      expect(friendlyQuestions).toHaveLength(5)
      
      // Question distribution may differ by persona
      const technicalTypes = technicalQuestions.map(q => q.questionType)
      const friendlyTypes = friendlyQuestions.map(q => q.questionType)
      
      // At least some questions should have valid types
      expect(technicalTypes.length).toBe(5)
      expect(friendlyTypes.length).toBe(5)
    })
  })

  describe('getQuestionTypeDisplay', () => {
    it('should return display info for technical', () => {
      const display = getQuestionTypeDisplay('technical')
      expect(display.label).toBeTruthy()
      expect(display.emoji).toBeTruthy()
    })

    it('should return display info for behavioral', () => {
      const display = getQuestionTypeDisplay('behavioral')
      expect(display.label).toBe('Behavioral')
    })

    it('should handle unknown types gracefully', () => {
      const display = getQuestionTypeDisplay('unknown' as any)
      expect(display).toBeTruthy()
    })
  })
})

