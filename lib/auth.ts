// NextAuth Configuration with Google OAuth
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"

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

// Real NextAuth configuration
const nextAuthConfig = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // On initial sign in, add user data to token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    session: async ({ session, token }) => {
      // Pass token data to session
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      // After sign in, redirect to dashboard
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return `${baseUrl}/dashboard`
    },
  },
  session: {
    strategy: "jwt", // Use JWT instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
})

// Export based on mode
export const { auth, signIn, signOut, handlers } = isDemoMode ? demoAuth as any : nextAuthConfig
