// API Route for Video/Audio Upload to Vercel Blob
import { auth } from "@/lib/auth"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const interviewId = formData.get("interviewId") as string

    if (!file || !interviewId) {
      return NextResponse.json(
        { error: "Missing file or interviewId" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`interviews/${interviewId}/${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

