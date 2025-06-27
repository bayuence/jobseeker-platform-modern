import { type NextRequest, NextResponse } from "next/server"

// Mock database
const users = [
  {
    id_card_number: "1234567890123456",
    password: "password123",
    name: "Doni Rianto",
    born_date: "1974-10-22",
    gender: "male",
    address: "Ki. Raya Setiabudhi No. 790",
    regional: {
      id: 1,
      province: "DKI Jakarta",
      district: "Central Jakarta",
    },
  },
  {
    id_card_number: "9876543210987654",
    password: "password456",
    name: "Siti Nurhaliza",
    born_date: "1985-05-15",
    gender: "female",
    address: "Jl. Sudirman No. 123",
    regional: {
      id: 2,
      province: "Jawa Barat",
      district: "Bandung",
    },
  },
]

// Simple hash function for token generation
function generateToken(idCardNumber: string): string {
  let hash = 0
  for (let i = 0; i < idCardNumber.length; i++) {
    const char = idCardNumber.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(32, "0")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_card_number, password } = body

    // Find user
    const user = users.find((u) => u.id_card_number === id_card_number && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "ID Card Number or Password incorrect" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(id_card_number)

    // Return user data with token
    const response = {
      name: user.name,
      born_date: user.born_date,
      gender: user.gender,
      address: user.address,
      token: token,
      regional: user.regional,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
