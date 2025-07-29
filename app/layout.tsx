import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/AuthContext"
import { ToastProvider } from "@/components/ui/toast-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobPortal Pro - Find Your Dream Career",
  description: "Connect with top employers and discover opportunities that match your skills and ambitions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
