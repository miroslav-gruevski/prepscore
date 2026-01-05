// Sign In Page - Testing Mode (No Auth Required)
import { redirect } from "next/navigation"

export default function SignInPage() {
  // Auto-redirect to dashboard (no auth required for testing)
  redirect("/dashboard")
}

