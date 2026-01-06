// NextAuth Configuration with Google OAuth
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Check if we're in demo mode (no Google credentials)
const isDemoMode = !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET

// Demo mode auth (for testing without OAuth)
const demoAuth = {
  auth: async () => ({
    user: {
      id: "demo-user-1",
      email: "demo@prepscore.app",
      name: "Demo User",
      image: null,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }),
  signIn: async () => true,
  signOut: async () => true,
  handlers: {
    GET: async () => new Response("Demo mode - OAuth disabled", { status: 200 }),
    POST: async () => new Response("Demo mode - OAuth disabled", { status: 200 }),
  },
}

// Real NextAuth configuration (JWT-based, no database adapter)
const nextAuthConfig = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      // On initial sign in, add user data to token
      if (account && profile) {
        token.id = profile.sub
        token.email = profile.email
        token.name = profile.name
        token.picture = profile.picture
      }
      return token
    },
    session: async ({ session, token }) => {
      // Pass token data to session
      if (session.user && token) {
        session.user.id = token.id as string || token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})

// Export based on mode
export const { auth, signIn, signOut, handlers } = isDemoMode ? demoAuth as any : nextAuthConfig
