// Hiring Signal Definitions by Persona

export interface HiringSignal {
  name: string
  definition: string
}

export const signalDefinitions: Record<string, HiringSignal[]> = {
  technical: [
    {
      name: "Problem Framing",
      definition: "Ability to break down complex problems into clear components",
    },
    {
      name: "Technical Depth",
      definition: "Understanding of technical concepts and ability to explain them clearly",
    },
    {
      name: "Trade-off Discussion",
      definition: "Awareness of pros/cons and ability to justify technical decisions",
    },
    {
      name: "Code Quality Awareness",
      definition: "Consideration for maintainability, testing, and best practices",
    },
    {
      name: "Communication Clarity",
      definition: "Ability to explain technical concepts to different audiences",
    },
  ],
  skeptic: [
    {
      name: "Defensiveness Under Pressure",
      definition: "Ability to remain composed when challenged or questioned",
    },
    {
      name: "Evidence-Based Reasoning",
      definition: "Supporting claims with data, examples, or concrete reasoning",
    },
    {
      name: "Receptiveness to Feedback",
      definition: "Openness to alternative viewpoints and constructive criticism",
    },
    {
      name: "Problem Ownership",
      definition: "Taking responsibility for challenges and demonstrating learning",
    },
    {
      name: "Confidence Without Arrogance",
      definition: "Asserting expertise while remaining humble and curious",
    },
  ],
  friendly: [
    {
      name: "Storytelling",
      definition: "Ability to share experiences in a structured and engaging way",
    },
    {
      name: "Collaboration Examples",
      definition: "Demonstrating teamwork and interpersonal skills",
    },
    {
      name: "Self-Awareness",
      definition: "Honest reflection on strengths, weaknesses, and growth areas",
    },
    {
      name: "Cultural Fit",
      definition: "Values alignment and enthusiasm for the role and company",
    },
    {
      name: "Curiosity",
      definition: "Asking thoughtful questions and showing genuine interest",
    },
  ],
  rushed: [
    {
      name: "Conciseness",
      definition: "Ability to communicate key points quickly without rambling",
    },
    {
      name: "Prioritization",
      definition: "Focus on the most important information first",
    },
    {
      name: "Composure Under Time Pressure",
      definition: "Remaining calm and organized when rushed",
    },
    {
      name: "Impact Focus",
      definition: "Emphasizing results and outcomes over process details",
    },
    {
      name: "Adaptability",
      definition: "Adjusting communication style to match interviewer's pace",
    },
  ],
}

export function getSignalsForPersona(persona: string): HiringSignal[] {
  return signalDefinitions[persona] || signalDefinitions.technical
}

