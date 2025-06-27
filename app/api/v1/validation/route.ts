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

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    const body = await request.json()
    const { work_experience, job_category, job_position, reason_accepted } = body

    if (!validateToken(token!)) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
    }

    if (!work_experience || !job_category || !job_position || !reason_accepted) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 })
    }

    const userId = getUserFromToken(token!)

    // Check if user already has validation request
    const existingValidation = globalThis.validations!.find((v: any) => v.user_id === userId)
    if (existingValidation) {
      return NextResponse.json({ message: "Validation request already exists" }, { status: 400 })
    }

    // Create new validation request with accepted status for demo
    const newValidation = {
      id: globalThis.validations!.length + 1,
      user_id: userId,
      status: "accepted", // Auto-accept for demo purposes
      work_experience,
      job_category_id: job_category,
      job_position,
      reason_accepted,
      validator_notes: "Data validation approved automatically for demo",
      validator: {
        id: 1,
        name: "Admin Validator",
      },
      created_at: new Date().toISOString(),
    }

    globalThis.validations!.push(newValidation)

    return NextResponse.json({ message: "Request data validation sent successful" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
