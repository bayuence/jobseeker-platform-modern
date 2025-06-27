"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  LogOut,
  FileCheck,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Send,
  Building2,
  Target,
} from "lucide-react"

interface UserData {
  name: string
  born_date: string
  gender: string
  address: string
  token: string
  regional: {
    id: number
    province: string
    district: string
  }
}

interface Validation {
  id: number
  status: "pending" | "accepted" | "rejected"
  work_experience: string | null
  job_category_id: string | null
  job_position: string | null
  reason_accepted: string | null
  validator_notes: string | null
  validator: any | null
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [validation, setValidation] = useState<Validation | null>(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchValidation(token)
    fetchApplications(token)
  }, [router])

  const fetchValidation = async (token: string) => {
    try {
      const response = await fetch(`/api/v1/validations?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setValidation(data.validation)
      }
    } catch (error) {
      console.error("Error fetching validation:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch(`/api/v1/applications?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.vacancies || [])
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
    }

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    {
      title: "Status Validasi",
      value: validation?.status || "Belum Ada",
      icon: FileCheck,
      color:
        validation?.status === "accepted"
          ? "text-green-600"
          : validation?.status === "pending"
            ? "text-yellow-600"
            : "text-red-600",
      bgColor:
        validation?.status === "accepted"
          ? "bg-green-100"
          : validation?.status === "pending"
            ? "bg-yellow-100"
            : "bg-red-100",
    },
    {
      title: "Total Lamaran",
      value: applications.length.toString(),
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Lamaran Diterima",
      value: applications
        .filter((app: any) => app.position?.some((pos: any) => pos.apply_status === "accepted"))
        .length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sedang Diproses",
      value: applications
        .filter((app: any) => app.position?.some((pos: any) => pos.apply_status === "pending"))
        .length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JobSeeker
                </h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.regional.province}</p>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user.name}! 👋</h2>
              <p className="text-blue-100 text-lg mb-6">Mari lanjutkan perjalanan karir Anda hari ini</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => router.push("/job-vacancies")}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  disabled={validation?.status !== "accepted"}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Cari Lowongan
                </Button>
                <Button
                  onClick={() => router.push("/validation")}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Validasi Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push("/validation")}
                  variant="outline"
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                >
                  <FileCheck className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Validasi Data</div>
                    <div className="text-xs text-gray-500">Kelola validasi profil</div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/job-vacancies")}
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200"
                  disabled={validation?.status !== "accepted"}
                >
                  <Briefcase className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Lowongan Kerja</div>
                    <div className="text-xs text-gray-500">Temukan pekerjaan impian</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200 bg-transparent"
                >
                  <User className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Edit Profil</div>
                    <div className="text-xs text-gray-500">Perbarui informasi</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span>Profil Saya</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.gender}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {user.regional.district}, {user.regional.province}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(user.born_date).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Kelengkapan Profil</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Lengkapi profil untuk peluang lebih baik</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Validation Status */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileCheck className="h-5 w-5 text-blue-600" />
                      <span>Status Validasi Data</span>
                    </CardTitle>
                    <CardDescription>Pantau status validasi profil Anda</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {validation ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-xl border ${getStatusColor(validation.status)}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(validation.status)}
                        <div>
                          <p className="font-semibold capitalize">{validation.status}</p>
                          <p className="text-sm opacity-80">
                            {validation.status === "accepted" && "Data Anda telah diverifikasi"}
                            {validation.status === "pending" && "Sedang dalam proses review"}
                            {validation.status === "rejected" && "Perlu perbaikan data"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {validation.job_position && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-medium text-gray-900 mb-1">Posisi yang Dilamar</p>
                        <p className="text-gray-700">{validation.job_position}</p>
                      </div>
                    )}

                    {validation.validator_notes && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="font-medium text-blue-900 mb-1">Catatan Validator</p>
                        <p className="text-blue-800">{validation.validator_notes}</p>
                      </div>
                    )}

                    {validation.status === "accepted" && (
                      <Button
                        onClick={() => router.push("/job-vacancies")}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Mulai Melamar Pekerjaan
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FileCheck className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Belum Ada Validasi</h3>
                    <p className="text-gray-600 mb-6">Ajukan validasi data untuk mulai melamar pekerjaan</p>
                    <Button
                      onClick={() => router.push("/validation")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Ajukan Validasi
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Applications */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Send className="h-5 w-5 text-green-600" />
                      <span>Lamaran Pekerjaan</span>
                    </CardTitle>
                    <CardDescription>Riwayat lamaran dan status terkini</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app: any, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{app.company}</h4>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {app.address}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {app.position?.map((pos: any, posIndex: number) => (
                            <div key={posIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{pos.position}</p>
                                <p className="text-sm text-gray-600">
                                  Dilamar pada {new Date().toLocaleDateString("id-ID")}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(pos.apply_status)} border`}>
                                {pos.apply_status === "accepted" && "Diterima"}
                                {pos.apply_status === "pending" && "Menunggu"}
                                {pos.apply_status === "rejected" && "Ditolak"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Send className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Belum Ada Lamaran</h3>
                    <p className="text-gray-600 mb-6">Mulai melamar pekerjaan yang sesuai dengan keahlian Anda</p>
                    <Button
                      onClick={() => router.push("/job-vacancies")}
                      disabled={validation?.status !== "accepted"}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Cari Lowongan Kerja
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
