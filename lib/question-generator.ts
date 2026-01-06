// Question generation based on role + persona
// Uses role-specific question banks for relevance

import { detectRoleCategory, roleSpecificQuestions } from './job-roles'

export type QuestionType = 'technical' | 'behavioral' | 'situational' | 'leadership' | 'problem_solving' | 'culture_fit' | 'soft_skills'

export interface GeneratedQuestion {
  questionNumber: number
  questionType: QuestionType
  questionText: string
}

// Persona-specific question mix (which types of questions to ask)
// Used as fallback when no specific focus category
const personaQuestionMix: Record<string, QuestionType[]> = {
  technical: ['technical', 'technical', 'situational', 'problem_solving', 'leadership'],
  skeptic: ['technical', 'behavioral', 'problem_solving', 'behavioral', 'situational'],
  friendly: ['behavioral', 'culture_fit', 'behavioral', 'leadership', 'culture_fit'],
  rushed: ['technical', 'behavioral', 'problem_solving', 'leadership', 'culture_fit'],
}

// Focus category question mixes
// Each focus category defines what types of questions to generate
const focusCategoryMix: Record<string, QuestionType[]> = {
  // Deep dive into role-specific technical questions
  technical: ['technical', 'technical', 'technical', 'problem_solving', 'situational'],
  // Past experiences and STAR-format questions
  behavioral: ['behavioral', 'behavioral', 'behavioral', 'behavioral', 'situational'],
  // Leadership and team management
  leadership: ['leadership', 'leadership', 'behavioral', 'leadership', 'situational'],
  // Analytical and structured problem-solving
  problem_solving: ['problem_solving', 'problem_solving', 'technical', 'problem_solving', 'situational'],
  // Communication, collaboration, and interpersonal skills
  soft_skills: ['soft_skills', 'soft_skills', 'soft_skills', 'behavioral', 'culture_fit'],
  // Values alignment and team dynamics
  culture_fit: ['culture_fit', 'culture_fit', 'behavioral', 'culture_fit', 'behavioral'],
  // Hypothetical scenario-based questions
  situational: ['situational', 'situational', 'behavioral', 'situational', 'problem_solving'],
  // Balanced mix of all types
  mixed: ['technical', 'behavioral', 'leadership', 'problem_solving', 'culture_fit'],
}

// Generic behavioral questions (work for any role)
const behavioralQuestions: string[] = [
  "Tell me about a time you disagreed with a decision. How did you handle it?",
  "Describe a situation where you had to meet a tight deadline. What was your approach?",
  "Tell me about a project that didn't go as planned. What did you learn?",
  "How do you handle receiving critical feedback on your work?",
  "Describe a time you had to work with a difficult colleague or client.",
  "Tell me about your most challenging problem at work and how you solved it.",
  "How do you prioritize when everything seems urgent?",
  "Describe a time you went above and beyond expectations.",
  "Tell me about a time you had to learn something new quickly.",
  "How do you handle ambiguity or unclear expectations?",
  "Tell me about a time you failed. What did you do next?",
  "Describe a situation where you had to influence someone without direct authority.",
]

// Generic leadership questions (work for any role with leadership aspects)
const leadershipQuestions: string[] = [
  "How do you approach mentoring or helping less experienced colleagues?",
  "Describe your leadership style and how it has evolved.",
  "How do you make decisions that affect others on your team?",
  "Tell me about a time you had to drive consensus on a difficult issue.",
  "How do you balance competing priorities in your work?",
  "Describe how you've helped someone grow in their role.",
  "How do you handle underperformance or conflicts in a team?",
  "What's your approach to giving constructive feedback?",
  "How do you foster a positive and productive work environment?",
  "Tell me about a time you had to push back on a request from leadership.",
]

// Generic problem-solving questions
const problemSolvingQuestions: string[] = [
  "Walk me through how you would approach solving a complex problem you've never seen before.",
  "How do you investigate when something isn't working as expected?",
  "Describe your systematic approach to troubleshooting issues.",
  "How do you break down large, ambiguous problems into manageable parts?",
  "Tell me about a creative solution you developed for a difficult challenge.",
  "How do you validate your assumptions when solving problems?",
  "Describe a time you had to make a decision with incomplete information.",
  "What frameworks or mental models do you use for problem-solving?",
  "How do you know when to stop iterating and ship a solution?",
  "Tell me about a time you identified a problem before it became critical.",
]

// Culture fit questions
const cultureFitQuestions: string[] = [
  "What type of work environment do you thrive in?",
  "How do you stay current with trends and best practices in your field?",
  "What motivates you in your work?",
  "Describe your ideal team culture.",
  "How do you handle work-life balance?",
  "What's the most important thing you're looking for in your next role?",
  "How do you prefer to receive feedback?",
  "What does collaboration mean to you?",
  "How do you approach learning new skills or concepts?",
  "What's your definition of success in a role like this?",
]

// Soft skills / communication questions
const softSkillsQuestions: string[] = [
  "Tell me about a time you had to explain a complex concept to someone without technical background.",
  "How do you handle disagreements with colleagues while maintaining professional relationships?",
  "Describe a situation where you had to adapt your communication style for different audiences.",
  "Tell me about a time you successfully mediated a conflict between team members.",
  "How do you build trust and rapport with new colleagues or clients?",
  "Describe a time when active listening helped you solve a problem.",
  "How do you ensure everyone's voice is heard during team discussions?",
  "Tell me about a time you had to deliver difficult feedback. How did you approach it?",
  "How do you handle situations where you disagree with a decision but need to support it?",
  "Describe your approach to giving and receiving constructive criticism.",
  "Tell me about a time you successfully persuaded someone to change their mind.",
  "How do you maintain positive relationships with stakeholders who have competing interests?",
]

// Situational questions by role category
const situationalQuestions: Record<string, string[]> = {
  frontend: [
    "A critical bug is reported in production affecting user checkout. Walk me through your debugging process.",
    "You need to improve page load time by 50%. What would you prioritize?",
    "A designer hands you mockups that seem technically complex. How do you approach the conversation?",
  ],
  backend: [
    "Your API starts returning slow responses during peak traffic. How do you investigate?",
    "You discover a database query that's causing performance issues. Walk me through your optimization approach.",
    "A third-party service your system depends on goes down. How do you handle it?",
  ],
  fullstack: [
    "You need to add a new feature that touches both frontend and backend. How do you plan your approach?",
    "Users report data inconsistencies between what they see and what's in the database. How do you debug?",
    "You're asked to build a real-time feature. What considerations go into your architecture decision?",
  ],
  mobile: [
    "Users complain about battery drain from your app. How do you investigate and fix it?",
    "You need to support both iOS and Android with limited resources. How do you make the decision?",
    "App store reviews mention crashes. Walk me through your crash investigation process.",
  ],
  data: [
    "A stakeholder reports that dashboard numbers don't match their expectations. How do you investigate?",
    "You need to process 10x more data than your current pipeline handles. What's your approach?",
    "You discover data quality issues affecting downstream reports. How do you handle it?",
  ],
  ml: [
    "Your model's performance degrades over time in production. How do you investigate?",
    "Stakeholders want to understand why the model made a specific prediction. How do you explain it?",
    "You need to deploy a model but have concerns about bias. What steps do you take?",
  ],
  devops: [
    "A deployment fails and you need to roll back quickly. Walk me through your process.",
    "You notice infrastructure costs have increased 40% this month. How do you investigate?",
    "A critical security vulnerability is announced. How do you prioritize and respond?",
  ],
  security: [
    "You discover a potential data breach. Walk me through your incident response.",
    "A new feature request raises security concerns. How do you communicate the risks?",
    "You need to implement security for a new application. Where do you start?",
  ],
  product: [
    "Engineering says your feature request will take 3x longer than expected. How do you handle it?",
    "Two stakeholders have conflicting priorities for the roadmap. How do you resolve it?",
    "User research contradicts what your biggest customer is asking for. What do you do?",
  ],
  design: [
    "Engineering pushes back on your design due to technical constraints. How do you handle it?",
    "Stakeholders disagree with your design direction. How do you navigate the situation?",
    "You have limited time for user research but need to make design decisions. What's your approach?",
  ],
  sales: [
    "A prospect goes silent after your proposal. How do you re-engage them?",
    "You're behind on your quarterly quota with one month left. What's your strategy?",
    "A customer is unhappy and threatening to churn. How do you handle the conversation?",
  ],
  marketing: [
    "A campaign underperforms significantly. How do you analyze what went wrong?",
    "You have limited budget but need to hit aggressive growth targets. How do you prioritize?",
    "Your brand messaging isn't resonating with the target audience. What's your approach?",
  ],
  finance: [
    "You discover a discrepancy in the financial reports. How do you investigate?",
    "The budget needs to be cut by 15%. How do you approach the analysis?",
    "A business unit is asking for budget that wasn't planned. How do you evaluate the request?",
  ],
  hr: [
    "An employee files a complaint about their manager. How do you handle it?",
    "You need to reduce headcount. How do you approach this difficult situation?",
    "Two top performers have a conflict that's affecting the team. What do you do?",
  ],
  operations: [
    "A key supplier fails to deliver on time. How do you manage the situation?",
    "You need to cut operational costs by 20% without affecting quality. What's your approach?",
    "A process that worked well suddenly starts failing. How do you investigate?",
  ],
  customerservice: [
    "A customer is extremely upset and demanding a refund you can't authorize. How do you handle it?",
    "Your team is overwhelmed with support tickets. How do you prioritize and manage?",
    "A recurring issue keeps generating support requests. How do you address it systematically?",
  ],
  healthcare: [
    "You have multiple patients needing attention simultaneously. How do you prioritize?",
    "A patient disagrees with the recommended treatment plan. How do you handle it?",
    "You notice a colleague making a potential error. What do you do?",
  ],
  education: [
    "A student is struggling despite your efforts. How do you adapt your approach?",
    "Parents disagree with your teaching methods. How do you handle the conversation?",
    "You have students at very different skill levels. How do you manage the classroom?",
  ],
  legal: [
    "You discover information that could affect an ongoing case. How do you handle it?",
    "A client wants to proceed despite your legal advice against it. What do you do?",
    "You're facing a tight deadline but need more time for proper research. How do you manage?",
  ],
  consulting: [
    "A client rejects your recommendations. How do you handle the pushback?",
    "You discover the project scope has expanded beyond the original agreement. What's your approach?",
    "Multiple clients have urgent needs at the same time. How do you prioritize?",
  ],
  hospitality: [
    "A VIP guest has a complaint during a fully booked night. How do you handle it?",
    "Staff call in sick during your busiest shift. What do you do?",
    "A guest's expectations far exceed what was promised. How do you manage the situation?",
  ],
  retail: [
    "A customer wants a return that doesn't meet policy. How do you handle it?",
    "You notice potential shoplifting. What's your approach?",
    "Sales are down and corporate is asking for explanations. How do you respond?",
  ],
  creative: [
    "A client keeps requesting revisions that go against design best practices. How do you handle it?",
    "You're experiencing creative block with a deadline approaching. What's your process?",
    "Your creative vision conflicts with the client's brief. How do you navigate it?",
  ],
  general: [
    "You're given a task with unclear instructions. How do you proceed?",
    "A colleague takes credit for your work. How do you handle the situation?",
    "You realize you made a mistake that affects others. What do you do?",
  ],
  leadership: [
    "Your team disagrees with a decision from upper management. How do you handle it?",
    "You need to let go of a team member who is well-liked. How do you approach it?",
    "Two of your direct reports have a conflict. How do you resolve it?",
  ],
}

// Persona modifiers
function applyPersonaModifier(question: string, persona: string): string {
  switch (persona) {
    case 'skeptic':
      const challenges = [
        " And what could go wrong with that approach?",
        " How would you handle the edge cases?",
        " What's the main weakness of that approach?",
        " Why should I believe that would work?",
      ]
      return question + challenges[Math.floor(Math.random() * challenges.length)]
    
    case 'rushed':
      return "Keep it brief: " + question
    
    default:
      return question
  }
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get questions for a specific type and role
function getQuestionsForType(type: QuestionType, roleCategory: string): string[] {
  switch (type) {
    case 'technical':
      // Use role-specific questions from job-roles.ts
      return roleSpecificQuestions[roleCategory] || roleSpecificQuestions.general || []
    
    case 'behavioral':
      return behavioralQuestions
    
    case 'situational':
      return situationalQuestions[roleCategory] || situationalQuestions.general || []
    
    case 'leadership':
      return leadershipQuestions
    
    case 'problem_solving':
      return problemSolvingQuestions
    
    case 'culture_fit':
      return cultureFitQuestions
    
    case 'soft_skills':
      return softSkillsQuestions
    
    default:
      return behavioralQuestions
  }
}

// Map question type to display type
function mapToDisplayType(type: QuestionType): QuestionType {
  // Keep types as-is for display
  return type
}

// Main function to generate 5 questions
export function generateInterviewQuestions(
  roleDescription: string,
  persona: string,
  focusCategory?: string
): GeneratedQuestion[] {
  // Use the comprehensive role detection from job-roles.ts
  const roleCategory = detectRoleCategory(roleDescription)
  
  console.log(`[Question Generator] Role: "${roleDescription}" -> Category: "${roleCategory}", Focus: "${focusCategory || 'default'}"`)
  
  // Get the question mix based on focus category (priority) or persona (fallback)
  const questionMix = focusCategory && focusCategoryMix[focusCategory]
    ? focusCategoryMix[focusCategory]
    : personaQuestionMix[persona] || personaQuestionMix.technical
  
  const questions: GeneratedQuestion[] = []
  const usedQuestions = new Set<string>()
  
  for (let i = 0; i < 5; i++) {
    const questionType = questionMix[i]
    const availableQuestions = getQuestionsForType(questionType, roleCategory)
    
    // Shuffle and find an unused question
    const shuffled = shuffleArray(availableQuestions)
    let selectedQuestion = shuffled[0] || "Tell me about your experience in this field."
    
    for (const q of shuffled) {
      if (!usedQuestions.has(q)) {
        selectedQuestion = q
        break
      }
    }
    
    usedQuestions.add(selectedQuestion)
    
    // Apply persona modifier
    const finalQuestion = applyPersonaModifier(selectedQuestion, persona)
    
    questions.push({
      questionNumber: i + 1,
      questionType: mapToDisplayType(questionType),
      questionText: finalQuestion,
    })
  }
  
  return questions
}

// Get question type display name
export function getQuestionTypeDisplay(type: QuestionType): { emoji: string; label: string } {
  const displays: Record<QuestionType, { emoji: string; label: string }> = {
    technical: { emoji: '💼', label: 'Role-Specific' },
    behavioral: { emoji: '💬', label: 'Behavioral' },
    situational: { emoji: '🎯', label: 'Situational' },
    leadership: { emoji: '👥', label: 'Leadership' },
    problem_solving: { emoji: '🧩', label: 'Problem Solving' },
    culture_fit: { emoji: '🤝', label: 'Culture Fit' },
    soft_skills: { emoji: '🗣️', label: 'Soft Skills' },
  }
  return displays[type] || { emoji: '❓', label: 'General' }
}

// Get persona display info
export function getPersonaDisplay(persona: string): { emoji: string; label: string; description: string } {
  const displays: Record<string, { emoji: string; label: string; description: string }> = {
    technical: { 
      emoji: '💻', 
      label: 'Technical Expert', 
      description: 'Deep role-specific questions, expects specific details and trade-offs' 
    },
    skeptic: { 
      emoji: '🤨', 
      label: 'The Skeptic', 
      description: 'Challenges your answers, tests composure under pressure' 
    },
    friendly: { 
      emoji: '😊', 
      label: 'Friendly Coach', 
      description: 'Conversational, focuses on culture fit and collaboration' 
    },
    rushed: { 
      emoji: '⏱️', 
      label: 'Rushed Manager', 
      description: 'Fast-paced, tests your ability to be concise' 
    },
  }
  return displays[persona] || displays.technical
}
