import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "JobSeeker Platform - Temukan Karir Impian Anda",
  description: "Platform terpercaya untuk menghubungkan pencari kerja dengan peluang karir terbaik di Indonesia",
  generator: "JobSeeker Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
