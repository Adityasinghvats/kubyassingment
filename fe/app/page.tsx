"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type PageState = "providers" | "slots" | "bookings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("providers")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter();

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setCurrentPage("slots")
  }

  const handleBackToProviders = () => {
    setSelectedProvider(null)
    setCurrentPage("providers")
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("providers")
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        {!isLoggedIn && currentPage === "providers" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Welcome to ConsultHub</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Book expert consultations with professional providers
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login to Browse Providers
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
