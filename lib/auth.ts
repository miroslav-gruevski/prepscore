// NextAuth Configuration with Google OAuth
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ token, profile }) => {
      if (profile) {
        token.id = profile.sub
        token.email = profile.email
        token.name = profile.name
        token.picture = profile.picture
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = (token.id || token.sub) as string
      }
      return session
    },
    authorized: async ({ auth }) => {
      // Allow access to all routes (we'll handle protection in pages)
      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
})
