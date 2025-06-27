"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Clock,
  Star,
  Target,
  MessageSquare,
} from "lucide-react"

interface JobVacancy {
  id: number
  category: {
    id: number
    job_category: string
  }
  company: string
  address: string
  description: string
  available_position: Array<{
    position: string
    capacity: number
    apply_capacity: number
    apply_count: number
  }>
}

export default function ApplyJobPage() {
  const [vacancy, setVacancy] = useState<JobVacancy | null>(null)
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    fetchVacancyDetail(token, params.id as string)
  }, [router, params.id])

  const fetchVacancyDetail = async (token: string, id: string) => {
    try {
      const response = await fetch(`/api/v1/job_vacancies/${id}?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setVacancy(data.vacancy)
      }
    } catch (error) {
      console.error("Error fetching vacancy detail:", error)
    }
  }

  const handlePositionChange = (position: string, checked: boolean) => {
    if (checked) {
      setSelectedPositions([...selectedPositions, position])
    } else {
      setSelectedPositions(selectedPositions.filter((p) => p !== position))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (selectedPositions.length === 0) {
      setError("Pilih minimal satu posisi")
      setLoading(false)
      return
    }

    if (!notes.trim()) {
      setError("Notes untuk perusahaan harus diisi")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    try {
      const response = await fetch(`/api/v1/applications?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vacancy_id: vacancy?.id,
          positions: selectedPositions,
          notes: notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Lamaran berhasil dikirim! Anda akan diarahkan ke dashboard.")
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else {
        setError(data.message || "Gagal mengirim lamaran")
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  const getAvailablePositions = () => {
    return vacancy?.available_position.filter((pos) => pos.apply_count < pos.capacity) || []
  }

  const getProgressPercentage = () => {
    if (currentStep === 1) return selectedPositions.length > 0 ? 33 : 0
    if (currentStep === 2) return notes.trim() ? 66 : 33
    return 100
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail lowongan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/job-vacancies")}
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Lowongan
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Lamar Pekerjaan</h1>
              </div>
            </div>

            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Clock className="h-3 w-3 mr-1" />
              Batas: 7 hari
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Progress Lamaran</h3>
              <span className="text-sm text-gray-600">{Math.round(getProgressPercentage())}% selesai</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              <span className={selectedPositions.length > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                1. Pilih Posisi
              </span>
              <span className={notes.trim() ? "text-green-600 font-medium" : "text-gray-500"}>2. Tulis Motivasi</span>
              <span className="text-gray-500">3. Kirim Lamaran</span>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl text-gray-900 mb-2">{vacancy.company}</CardTitle>
                <CardDescription className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  {vacancy.address}
                </CardDescription>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-blue-100 text-blue-700">{vacancy.category.job_category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    4.5 Rating
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    500+ Karyawan
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Deskripsi Perusahaan
              </h4>
              <p className="text-gray-700 leading-relaxed">{vacancy.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Form Lamaran Pekerjaan</span>
            </CardTitle>
            <CardDescription>Lengkapi informasi di bawah untuk mengirim lamaran Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Position Selection */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <Label className="text-lg font-semibold text-gray-900">Pilih Posisi yang Dilamar</Label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Tips Melamar</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Pilih posisi yang sesuai dengan keahlian dan pengalaman Anda untuk meningkatkan peluang diterima.
                  </p>
                </div>

                <div className="grid gap-4">
                  {vacancy.available_position.map((position, index) => {
                    const isAvailable = position.apply_count < position.capacity
                    const fillPercentage = (position.apply_count / position.capacity) * 100

                    return (
                      <div
                        key={index}
                        className={`border rounded-xl p-6 transition-all duration-200 ${
                          isAvailable
                            ? selectedPositions.includes(position.position)
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={selectedPositions.includes(position.position)}
                            onCheckedChange={(checked) => handlePositionChange(position.position, checked as boolean)}
                            disabled={!isAvailable}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{position.position}</h4>
                              <Badge
                                variant={isAvailable ? "secondary" : "destructive"}
                                className={isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                              >
                                {isAvailable ? "Tersedia" : "Penuh"}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Kapasitas</span>
                                <span className="font-medium">
                                  {position.apply_count} / {position.capacity} pelamar
                                </span>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    fillPercentage >= 80
                                      ? "bg-red-500"
                                      : fillPercentage >= 60
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                                ></div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Peluang: {isAvailable ? "Tinggi" : "Tidak tersedia"}</span>
                                <span>{Math.round(fillPercentage)}% terisi</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Motivation Letter */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <Label htmlFor="notes" className="text-lg font-semibold text-gray-900">
                    Surat Motivasi
                  </Label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Panduan Menulis</span>
                  </div>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Jelaskan mengapa Anda tertarik dengan posisi ini</li>
                    <li>• Sebutkan keahlian dan pengalaman yang relevan</li>
                    <li>• Tunjukkan antusiasme dan motivasi Anda</li>
                    <li>• Gunakan bahasa yang profesional dan sopan</li>
                  </ul>
                </div>

                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Saya sangat tertarik dengan posisi ini karena sesuai dengan latar belakang pendidikan saya di bidang... Pengalaman saya selama... telah membekali saya dengan kemampuan... Saya yakin dapat berkontribusi positif untuk perusahaan..."
                  rows={8}
                  className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Minimal 100 karakter</span>
                  <span>{notes.length} karakter</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Siap mengirim lamaran?</h4>
                    <p className="text-sm text-gray-600">Pastikan semua informasi sudah benar sebelum mengirim</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Posisi dipilih</p>
                    <p className="font-semibold text-blue-600">{selectedPositions.length}</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  disabled={loading || selectedPositions.length === 0 || !notes.trim()}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Mengirim Lamaran...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-5 w-5" />
                      <span>Kirim Lamaran Sekarang</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
