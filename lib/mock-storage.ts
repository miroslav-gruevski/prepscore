// Shared in-memory storage for interviews (testing without database)
export const mockInterviews: any[] = []

export function addInterview(interview: any) {
  mockInterviews.push(interview)
  return interview
}

export function getInterview(id: string) {
  return mockInterviews.find(i => i.id === id)
}

export function getAllInterviews() {
  return mockInterviews
}

export function updateInterview(id: string, updates: any) {
  const index = mockInterviews.findIndex(i => i.id === id)
  if (index !== -1) {
    mockInterviews[index] = { ...mockInterviews[index], ...updates }
    return mockInterviews[index]
  }
  return null
}

export function deleteInterview(id: string) {
  const index = mockInterviews.findIndex(i => i.id === id)
  if (index !== -1) {
    mockInterviews.splice(index, 1)
    return true
  }
  return false
}

