// Simplified Auth for Testing (No OAuth required)
// Returns a mock session for development/testing

export async function auth() {
  // Mock user session for testing
  return {
    user: {
      id: "test-user-1",
      email: "test@example.com",
      name: "Test User",
      image: null,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export async function signIn() {
  // Mock sign in
  return true
}

export async function signOut() {
  // Mock sign out
  return true
}

export const handlers = {
  GET: async () => new Response("Auth disabled for testing", { status: 200 }),
  POST: async () => new Response("Auth disabled for testing", { status: 200 }),
}

