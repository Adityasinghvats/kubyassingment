"use client"

import { useState } from "react"
import { Menu, X, LogIn, LogOut, Calendar } from "lucide-react"

interface NavbarProps {
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
  onNavigate: (page: "providers" | "bookings") => void
}

export default function Navbar({ isLoggedIn, onLogin, onLogout, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate("providers")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">ConsultHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate("providers")}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Browse Providers
                </button>
                <button
                  onClick={() => onNavigate("bookings")}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </button>
              </>
            )}

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn && (
              <button onClick={() => onNavigate("bookings")} className="p-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
            {isLoggedIn && (
              <>
                <button
                  onClick={() => {
                    onNavigate("providers")
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded"
                >
                  Browse Providers
                </button>
                <button
                  onClick={() => {
                    onNavigate("bookings")
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded"
                >
                  My Bookings
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (isLoggedIn) onLogout()
                else onLogin()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded font-medium"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
