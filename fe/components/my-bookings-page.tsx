"use client"

import { Calendar, Clock, X } from "lucide-react"

interface Booking {
  id: string
  providerId: string
  providerName: string
  specialty: string
  date: string
  time: string
  duration: number
  cost: number
  status: "upcoming" | "completed" | "cancelled"
}

const mockBookings: Booking[] = [
  {
    id: "1",
    providerId: "1",
    providerName: "Dr. Sarah Anderson",
    specialty: "Business Strategy",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "14:00",
    duration: 60,
    cost: 150,
    status: "upcoming",
  },
  {
    id: "2",
    providerId: "3",
    providerName: "Emma Wilson",
    specialty: "Financial Planning",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    time: "10:30",
    duration: 30,
    cost: 90,
    status: "upcoming",
  },
  {
    id: "3",
    providerId: "2",
    providerName: "Mark Johnson",
    specialty: "Marketing & Growth",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    time: "15:30",
    duration: 60,
    cost: 120,
    status: "completed",
  },
]

interface MyBookingsPageProps {
  onNavigate: () => void
}

export default function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming")
  const completedBookings = mockBookings.filter((b) => b.status === "completed")

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
      case "cancelled":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would call an API
    console.log("Cancelled booking:", bookingId)
  }

  const BookingCard = ({ booking, canCancel }: { booking: Booking; canCancel: boolean }) => (
    <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{booking.providerName}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{booking.specialty}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {booking.time} · {booking.duration} minutes
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Cost</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">${booking.cost.toFixed(2)}</p>
        </div>
        {canCancel && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Cancel booking"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage and view all your consultation bookings</p>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            Upcoming Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} canCancel={true} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Bookings */}
      {completedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded-full"></div>
            Completed Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} canCancel={false} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {mockBookings.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Start booking consultations with expert providers</p>
          <button
            onClick={onNavigate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Providers
          </button>
        </div>
      )}
    </div>
  )
}
