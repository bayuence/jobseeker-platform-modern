"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Users,
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  Eye,
  Send,
  Briefcase,
  Grid3X3,
  List,
  SlidersHorizontal,
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
    apply_count?: number
  }>
}

export default function JobVacanciesPage() {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([])
  const [filteredVacancies, setFilteredVacancies] = useState<JobVacancy[]>([])
  const [appliedVacancies, setAppliedVacancies] = useState<number[]>([])
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    fetchVacancies(token)
    fetchApplications(token)
  }, [router])

  useEffect(() => {
    filterVacancies()
  }, [vacancies, searchTerm, selectedCategory, selectedLocation])

  const fetchVacancies = async (token: string) => {
    try {
      const response = await fetch(`/api/v1/job_vacancies?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setVacancies(data.vacancies || [])
      }
    } catch (error) {
      console.error("Error fetching vacancies:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch(`/api/v1/applications?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        const appliedIds = data.vacancies?.map((v: any) => v.id) || []
        setAppliedVacancies(appliedIds)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const filterVacancies = () => {
    let filtered = vacancies

    if (searchTerm) {
      filtered = filtered.filter(
        (vacancy) =>
          vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacancy.available_position.some((pos) => pos.position.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((vacancy) => vacancy.category.job_category === selectedCategory)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((vacancy) => vacancy.address.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    setFilteredVacancies(filtered)
  }

  const toggleBookmark = (jobId: number) => {
    setBookmarkedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const getUniqueCategories = () => {
    const categories = vacancies.map((v) => v.category.job_category)
    return [...new Set(categories)]
  }

  const getUniqueLocations = () => {
    const locations = vacancies.map((v) => v.address.split(",")[0].trim())
    return [...new Set(locations)]
  }

  const getTotalPositions = (vacancy: JobVacancy) => {
    return vacancy.available_position.reduce((total, pos) => total + pos.capacity, 0)
  }

  const getAppliedCount = (vacancy: JobVacancy) => {
    return vacancy.available_position.reduce((total, pos) => total + (pos.apply_count || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat lowongan pekerjaan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Lowongan Pekerjaan</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Temukan Pekerjaan Impian Anda</h2>
            <p className="text-blue-100 text-lg mb-6">
              {filteredVacancies.length} lowongan tersedia dari perusahaan terpercaya
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Building2 className="h-4 w-4" />
                <span>{vacancies.length} Perusahaan</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Users className="h-4 w-4" />
                <span>{vacancies.reduce((total, v) => total + getTotalPositions(v), 0)} Posisi</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Send className="h-4 w-4" />
                <span>{appliedVacancies.length} Lamaran Anda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Cari perusahaan, posisi, atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Kategori Pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredVacancies.length} dari {vacancies.length} lowongan
              </p>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter Lanjutan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        {filteredVacancies.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredVacancies.map((vacancy) => {
              const isApplied = appliedVacancies.includes(vacancy.id)
              const isBookmarked = bookmarkedJobs.includes(vacancy.id)
              const totalPositions = getTotalPositions(vacancy)
              const appliedCount = getAppliedCount(vacancy)

              return (
                <Card
                  key={vacancy.id}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm group ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={viewMode === "list" ? "flex w-full" : ""}>
                    <CardHeader className={`${viewMode === "list" ? "flex-1" : ""} pb-4`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {vacancy.company}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1 text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {vacancy.address}
                            </CardDescription>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {vacancy.category.job_category}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                Baru diposting
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(vacancy.id)}
                          className="hover:bg-yellow-50 hover:text-yellow-600"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className={`${viewMode === "list" ? "flex-1" : ""} space-y-4`}>
                      <p className="text-sm text-gray-600 line-clamp-2">{vacancy.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Posisi Tersedia</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            {appliedCount}/{totalPositions} pelamar
                          </div>
                        </div>

                        <div className="space-y-2">
                          {vacancy.available_position.slice(0, 2).map((position, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{position.position}</p>
                                <p className="text-xs text-gray-500">
                                  {position.apply_count || 0} dari {position.capacity} pelamar
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${Math.min(((position.apply_count || 0) / position.capacity) * 100, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {vacancy.available_position.length > 2 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{vacancy.available_position.length - 2} posisi lainnya
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button
                          onClick={() => router.push(`/job-vacancies/${vacancy.id}`)}
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                        {isApplied ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 bg-green-100 text-green-700 hover:bg-green-200"
                            disabled
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Sudah Melamar
                          </Button>
                        ) : (
                          <Button
                            onClick={() => router.push(`/job-vacancies/${vacancy.id}/apply`)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Lamar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tidak Ada Lowongan Ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah kata kunci pencarian atau filter yang Anda gunakan</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedLocation("all")
                }}
                variant="outline"
              >
                Reset Filter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
