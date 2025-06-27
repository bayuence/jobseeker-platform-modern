import { type NextRequest, NextResponse } from "next/server"

// Mock database for job vacancies
const jobVacancies = [
  {
    id: 1,
    category: {
      id: 1,
      job_category: "Technology",
    },
    company: "PT. MajuMundur Sejahtera",
    address: "Jl. Gotong Royong No. 123, Jakarta",
    description: "Lowongan pekerjaan untuk beberapa posisi teknologi",
    available_position: [
      {
        position: "Web Developer",
        capacity: 5,
        apply_capacity: 15,
        apply_count: 3,
      },
      {
        position: "Mobile Developer",
        capacity: 3,
        apply_capacity: 10,
        apply_count: 1,
      },
    ],
  },
  {
    id: 2,
    category: {
      id: 2,
      job_category: "Marketing",
    },
    company: "CV. Kreatif Digital",
    address: "Jl. Sudirman No. 456, Bandung",
    description: "Perusahaan digital marketing terkemuka",
    available_position: [
      {
        position: "Digital Marketing Specialist",
        capacity: 2,
        apply_capacity: 8,
        apply_count: 2,
      },
      {
        position: "Content Creator",
        capacity: 4,
        apply_capacity: 12,
        apply_count: 0,
      },
    ],
  },
  {
    id: 3,
    category: {
      id: 4,
      job_category: "Design",
    },
    company: "Studio Desain Kreatif",
    address: "Jl. Raya Kemang No. 789, Jakarta Selatan",
    description: "Studio desain yang mengerjakan berbagai proyek kreatif",
    available_position: [
      {
        position: "Graphic Designer",
        capacity: 3,
        apply_capacity: 9,
        apply_count: 1,
      },
      {
        position: "UI/UX Designer",
        capacity: 2,
        apply_capacity: 6,
        apply_count: 0,
      },
    ],
  },
]

function validateToken(token: string): boolean {
  return token && token.length === 32
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!validateToken(token!)) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
    }

    return NextResponse.json({ vacancies: jobVacancies }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
