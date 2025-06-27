import { type NextRequest, NextResponse } from "next/server"

// Declare global validations
declare global {
  var validations: any[] | undefined
}

// Initialize global validations if not exists
if (!globalThis.validations) {
  globalThis.validations = []
}

function validateToken(token: string): boolean {
  return token && token.length === 32
}

function getUserFromToken(token: string): string {
  return token.substring(0, 8)
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!validateToken(token!)) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
    }

    const userId = getUserFromToken(token!)

    // Find validation for this user from global state
    const validation = globalThis.validations!.find((v: any) => v.user_id === userId)

    return NextResponse.json({ validation: validation || null }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
