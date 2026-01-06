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
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
})

// Export based on mode
export const { auth, signIn, signOut, handlers } = isDemoMode ? demoAuth as any : nextAuthConfig
