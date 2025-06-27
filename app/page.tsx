"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Briefcase, Users, TrendingUp, Shield, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [idCardNumber, setIdCardNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_card_number: idCardNumber,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data))
        router.push("/dashboard")
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        {/* Decorative dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Logo and Brand */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">JobSeeker</h1>
              <p className="text-blue-100 text-sm">Platform Pencari Kerja</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Temukan Karir
              <br />
              <span className="text-yellow-300">Impian Anda</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Platform terpercaya untuk menghubungkan pencari kerja dengan peluang karir terbaik di Indonesia.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-2">
              <Users className="h-6 w-6 text-white mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-blue-100 text-sm">Pencari Kerja</div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-2">
              <Briefcase className="h-6 w-6 text-white mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">5K+</div>
            <div className="text-blue-100 text-sm">Lowongan Aktif</div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-2">
              <TrendingUp className="h-6 w-6 text-white mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">95%</div>
            <div className="text-blue-100 text-sm">Tingkat Sukses</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobSeeker
              </h1>
              <p className="text-gray-600 text-sm">Platform Pencari Kerja</p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Masuk ke akun Anda untuk melanjutkan pencarian kerja
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="idCard" className="text-gray-700 font-medium">
                    Nomor KTP
                  </Label>
                  <div className="relative">
                    <Input
                      id="idCard"
                      type="text"
                      value={idCardNumber}
                      onChange={(e) => setIdCardNumber(e.target.value)}
                      placeholder="Masukkan nomor KTP Anda"
                      required
                      className="h-12 pl-4 pr-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 bg-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      required
                      className="h-12 pl-4 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Masuk ke Dashboard"
                  )}
                </Button>
              </form>

              {/* Additional Links */}
              <div className="text-center space-y-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                    Daftar sekarang
                  </button>
                </p>
                <p className="text-sm">
                  <button className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
                    Lupa password?
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Dipercaya oleh ribuan pencari kerja</p>
            <div className="flex items-center justify-center space-x-6 opacity-60">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-600">Aman & Terpercaya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-600">10K+ Pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
