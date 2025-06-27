"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  FileCheck,
  Briefcase,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Lightbulb,
  Star,
  Award,
  BookOpen,
} from "lucide-react"

const jobCategories = [
  { id: "1", name: "Technology", icon: "💻", description: "Software, IT, Programming" },
  { id: "2", name: "Marketing", icon: "📈", description: "Digital Marketing, Sales, Branding" },
  { id: "3", name: "Finance", icon: "💰", description: "Accounting, Banking, Investment" },
  { id: "4", name: "Design", icon: "🎨", description: "UI/UX, Graphic, Creative" },
  { id: "5", name: "Sales", icon: "🤝", description: "Business Development, Customer Relations" },
]

const workExperienceOptions = [
  { value: "Fresh Graduate", label: "Fresh Graduate", icon: "🎓", color: "bg-green-100 text-green-700" },
  { value: "1-2 years", label: "1-2 Tahun", icon: "🌱", color: "bg-blue-100 text-blue-700" },
  { value: "3-5 years", label: "3-5 Tahun", icon: "🚀", color: "bg-purple-100 text-purple-700" },
  { value: "5+ years", label: "5+ Tahun", icon: "⭐", color: "bg-yellow-100 text-yellow-700" },
]

interface ValidationStatus {
  id: number
  status: "pending" | "accepted" | "rejected"
  job_position: string | null
  validator_notes: string | null
  created_at?: string
}

export default function ValidationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    job_category: "",
    work_experience: "",
    job_position: "",
    work_experience_detail: "",
    reason_accepted: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null)
  const [hasValidation, setHasValidation] = useState(false)
  const router = useRouter()

  const totalSteps = 4

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    checkExistingValidation(token)
  }, [router])

  const checkExistingValidation = async (token: string) => {
    try {
      const response = await fetch(`/api/v1/validations?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        if (data.validation) {
          setValidationStatus(data.validation)
          setHasValidation(true)
        }
      }
    } catch (error) {
      console.error("Error checking validation:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (
      !formData.job_category ||
      !formData.work_experience ||
      !formData.job_position ||
      !formData.work_experience_detail ||
      !formData.reason_accepted
    ) {
      setError("Semua field harus diisi")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    try {
      const response = await fetch(`/api/v1/validation?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_category: formData.job_category,
          work_experience: formData.work_experience_detail,
          job_position: formData.job_position,
          reason_accepted: formData.reason_accepted,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Permintaan validasi data berhasil dikirim! Anda akan diarahkan ke dashboard.")
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else {
        setError(data.message || "Gagal mengirim permintaan")
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.job_category !== ""
      case 2:
        return formData.work_experience !== "" && formData.work_experience_detail.trim() !== ""
      case 3:
        return formData.job_position.trim() !== ""
      case 4:
        return formData.reason_accepted.trim() !== ""
      default:
        return false
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      default:
        return <FileCheck className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 border-green-200 text-green-800"
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800"
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  if (hasValidation && validationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Status Validasi</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4">{getStatusIcon(validationStatus.status)}</div>
              <CardTitle className="text-2xl">Status Validasi Data</CardTitle>
              <CardDescription>Informasi terkini tentang permintaan validasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${getStatusColor(validationStatus.status)}`}>
                <div className="text-center mb-4">
                  <Badge
                    className={`text-lg px-4 py-2 ${
                      validationStatus.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : validationStatus.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {validationStatus.status === "accepted" && "✅ Disetujui"}
                    {validationStatus.status === "pending" && "⏳ Sedang Diproses"}
                    {validationStatus.status === "rejected" && "❌ Ditolak"}
                  </Badge>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {validationStatus.status === "accepted" && "Selamat! Data Anda Telah Divalidasi"}
                    {validationStatus.status === "pending" && "Permintaan Sedang Diproses"}
                    {validationStatus.status === "rejected" && "Permintaan Perlu Diperbaiki"}
                  </h3>
                  <p className="text-sm opacity-80">
                    {validationStatus.status === "accepted" &&
                      "Anda sekarang dapat melamar pekerjaan yang tersedia di platform"}
                    {validationStatus.status === "pending" &&
                      "Tim kami sedang meninjau data Anda. Proses ini biasanya memakan waktu 1-3 hari kerja"}
                    {validationStatus.status === "rejected" &&
                      "Silakan perbaiki data sesuai catatan di bawah dan ajukan ulang"}
                  </p>
                </div>
              </div>

              {validationStatus.job_position && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Posisi yang Dilamar
                  </h4>
                  <p className="text-blue-800">{validationStatus.job_position}</p>
                </div>
              )}

              {validationStatus.validator_notes && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Catatan Validator
                  </h4>
                  <p className="text-gray-700">{validationStatus.validator_notes}</p>
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-6">
                {validationStatus.status === "accepted" && (
                  <Button
                    onClick={() => router.push("/job-vacancies")}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Mulai Melamar Pekerjaan
                  </Button>
                )}
                <Button onClick={() => router.push("/dashboard")} variant="outline">
                  Kembali ke Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Validasi Data</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Validasi Data Profil</h2>
            <p className="text-blue-100 text-lg mb-6">
              Lengkapi validasi data untuk dapat melamar pekerjaan di platform kami
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Proses Cepat</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <FileCheck className="h-4 w-4" />
                <span>Data Aman</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Star className="h-4 w-4" />
                <span>Akses Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Progress Validasi</h3>
              <span className="text-sm text-gray-600">
                Langkah {currentStep} dari {totalSteps}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3 mb-4" />
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>
                1. Kategori Pekerjaan
              </span>
              <span className={currentStep >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>
                2. Pengalaman Kerja
              </span>
              <span className={currentStep >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>3. Posisi Target</span>
              <span className={currentStep >= 4 ? "text-blue-600 font-medium" : "text-gray-500"}>4. Motivasi</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                {currentStep}
              </div>
              <span>
                {currentStep === 1 && "Pilih Kategori Pekerjaan"}
                {currentStep === 2 && "Pengalaman Kerja"}
                {currentStep === 3 && "Posisi yang Diinginkan"}
                {currentStep === 4 && "Alasan & Motivasi"}
              </span>
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Pilih kategori pekerjaan yang sesuai dengan minat dan keahlian Anda"}
              {currentStep === 2 && "Ceritakan pengalaman kerja dan keahlian yang Anda miliki"}
              {currentStep === 3 && "Jelaskan posisi pekerjaan yang Anda inginkan"}
              {currentStep === 4 && "Berikan alasan mengapa Anda layak diterima"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Step 1: Job Category */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Tips Memilih Kategori</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Pilih kategori yang paling sesuai dengan latar belakang pendidikan dan minat karir Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                          formData.job_category === category.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => setFormData({ ...formData, job_category: category.id })}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        {formData.job_category === category.id && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Dipilih</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Work Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Tentang Pengalaman Kerja</span>
                    </div>
                    <p className="text-purple-700 text-sm">
                      Jujur dalam menyampaikan pengalaman. Fresh graduate juga sangat dihargai!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Level Pengalaman</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {workExperienceOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            formData.work_experience === option.value
                              ? "border-purple-500 bg-purple-50 shadow-md"
                              : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                          }`}
                          onClick={() => setFormData({ ...formData, work_experience: option.value })}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{option.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{option.label}</p>
                              {formData.work_experience === option.value && (
                                <div className="flex items-center space-x-1 text-purple-600 mt-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span className="text-xs">Dipilih</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workExperienceDetail" className="text-base font-semibold">
                      Detail Pengalaman Kerja
                    </Label>
                    <Textarea
                      id="workExperienceDetail"
                      value={formData.work_experience_detail}
                      onChange={(e) => setFormData({ ...formData, work_experience_detail: e.target.value })}
                      placeholder="Contoh: Saya memiliki pengalaman 2 tahun sebagai Frontend Developer di PT ABC. Menguasai React, JavaScript, dan TypeScript. Pernah mengembangkan aplikasi web untuk 10+ klien..."
                      rows={6}
                      className="resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Minimal 50 karakter</span>
                      <span>{formData.work_experience_detail.length} karakter</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Job Position */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Target Karir</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Jelaskan posisi spesifik yang Anda inginkan dan sesuaikan dengan pengalaman Anda.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobPosition" className="text-base font-semibold">
                      Posisi yang Diinginkan
                    </Label>
                    <Textarea
                      id="jobPosition"
                      value={formData.job_position}
                      onChange={(e) => setFormData({ ...formData, job_position: e.target.value })}
                      placeholder="Contoh: Frontend Developer dengan fokus pada React dan TypeScript. Tertarik pada posisi yang memungkinkan saya berkontribusi dalam pengembangan aplikasi web modern dan berkolaborasi dengan tim yang dinamis..."
                      rows={5}
                      className="resize-none border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Minimal 30 karakter</span>
                      <span>{formData.job_position.length} karakter</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Reason to be Accepted */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Panduan Menulis Motivasi</span>
                    </div>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Jelaskan keunikan dan nilai tambah yang Anda bawa</li>
                      <li>• Tunjukkan antusiasme dan komitmen Anda</li>
                      <li>• Sebutkan pencapaian atau proyek yang relevan</li>
                      <li>• Gunakan bahasa yang profesional namun personal</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonAccepted" className="text-base font-semibold">
                      Alasan Mengapa Anda Layak Diterima
                    </Label>
                    <Textarea
                      id="reasonAccepted"
                      value={formData.reason_accepted}
                      onChange={(e) => setFormData({ ...formData, reason_accepted: e.target.value })}
                      placeholder="Contoh: Saya memiliki passion yang tinggi dalam teknologi dan selalu mengikuti perkembangan terbaru. Dengan pengalaman mengembangkan 5+ aplikasi web dan kemampuan problem-solving yang baik, saya yakin dapat memberikan kontribusi maksimal. Saya juga memiliki kemampuan komunikasi yang baik dan senang bekerja dalam tim..."
                      rows={8}
                      className="resize-none border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Minimal 100 karakter</span>
                      <span>{formData.reason_accepted.length} karakter</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading || !isStepValid(currentStep)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Kirim Permintaan</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
