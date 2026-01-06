// NextAuth Configuration with Google OAuth
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account", // Always show account picker
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ token, profile, account }) => {
      // On initial sign-in, profile and account are available
      if (profile && account) {
        token.id = profile.sub
        token.email = profile.email
        token.name = profile.name
        token.picture = profile.picture
        console.log('[Auth] JWT created for user:', profile.email)
      }
      // Ensure id is always set from sub if not already
      if (!token.id && token.sub) {
        token.id = token.sub
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        // Use id from token, fall back to sub
        session.user.id = (token.id || token.sub) as string
        console.log('[Auth] Session created for user:', session.user.email, 'id:', session.user.id)
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
