// NextAuth Middleware (temporarily disabled for demo)
// export { auth as middleware } from "@/lib/auth"

// Temporarily allow all routes for demo purposes
export function middleware() {
  return null
}

export const config = {
  matcher: ["/dashboard/:path*", "/interview/:path*", "/api/interviews/:path*"],
}

