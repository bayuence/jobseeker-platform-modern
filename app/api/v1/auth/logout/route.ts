import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // In a real application, you would invalidate the token in the database
    // For this demo, we'll just return success
    return NextResponse.json({ message: "Logout success" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
