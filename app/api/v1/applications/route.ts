import { type NextRequest, NextResponse } from "next/server"

// Global applications array
const applications: any[] = []

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

    if (!validateToken(token!)) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
    }

    const userId = getUserFromToken(token!)

    // Check if user's validation is accepted (simplified check)
    // In real app, check against validation database
    const body = await request.json()
    const { vacancy_id, positions, notes } = body

    // Validate required fields
    if (!vacancy_id || !positions || positions.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid field",
          errors: {
            vacancy_id: !vacancy_id ? ["The vacancy id field is required."] : [],
            positions: !positions || positions.length === 0 ? ["The position field is required."] : [],
          },
        },
        { status: 401 },
      )
    }

    // Check if user already applied for this vacancy
    const existingApplication = applications.find((app) => app.user_id === userId && app.vacancy_id === vacancy_id)

    if (existingApplication) {
      return NextResponse.json({ message: "Application for a job can only be once" }, { status: 401 })
    }

    // Create new application
    const newApplication = {
      id: applications.length + 1,
      user_id: userId,
      vacancy_id,
      positions: positions.map((pos: string) => ({
        position: pos,
        apply_status: "pending",
        notes: notes || "",
      })),
      created_at: new Date().toISOString(),
    }

    applications.push(newApplication)

    return NextResponse.json({ message: "Applying for job successful" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!validateToken(token!)) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
    }

    const userId = getUserFromToken(token!)
    const userApplications = applications.filter((app) => app.user_id === userId)

    // Transform applications to match expected format
    const vacancies = userApplications.map((app) => ({
      id: app.vacancy_id,
      category: {
        id: 1,
        job_category: "Technology",
      },
      company: "PT. MajuMundur Sejahtera",
      address: "Jl. Gotong Royong No. 123, Jakarta",
      position: app.positions,
    }))

    return NextResponse.json({ vacancies }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
