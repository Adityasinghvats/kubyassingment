"use client"

import { Calendar, Clock, X } from "lucide-react"
import { Booking } from "@/interfaces/booking/interface"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingAPI } from "@/services/bookingService"
import { useAuth } from "@/hooks/use-auth"
import { formatDate, formatDuration, formatTime } from "@/lib/format"

interface MyBookingsPageProps {
  bookings: Booking[]
}

export default function MyBookingsPage({ bookings }: MyBookingsPageProps) {

  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: cancelBooking, isPending: isCancelling } = useMutation({
    mutationFn: bookingAPI.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: Error) => {
      console.error("Error cancelling booking:", error);
    },
  });

  const { mutate: completeBooking, isPending: isCompleting } = useMutation({
    mutationFn: bookingAPI.completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: Error) => {
      console.error("Error completing booking:", error);
    },
  });

  const upcomingBookings = bookings?.filter((b) => b.status === "PENDING") || []
  const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") || []
  const cancelledBookings = bookings?.filter((b) => b.status === "CANCELLED") || []

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "COMPLETED":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
      case "CANCELLED":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
  }
  const handleCompleteBooking = (bookingId: string) => {
    completeBooking(bookingId);
  }

  const BookingCard = ({ booking, canCancel, canComplete }: { booking: Booking; canCancel: boolean; canComplete: boolean }) => (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs text-slate-600 dark:text-slate-400 mb-1">Booking Provider</h3>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{booking.provider.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{booking.provider?.description}</p>
        </div>

        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      <div className="mb-4">
        <h3 className="text-xs text-slate-600 dark:text-slate-400 mb-1">Booking Client</h3>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{booking.client.name}</h3>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">{formatDate(booking.slot.startTime)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {formatTime(booking.slot.startTime)} · {formatTime(booking.slot.endTime)} ({formatDuration(booking.slot.duration)})
          </span>
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Description</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{booking?.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Cost</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">${booking.finalCost}</p>
        </div>

      </div>
      <div className="flex flex-row gap-2 mt-4">
        {canCancel && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Cancel booking"
          >
            {isCancelling ? "Cancelling..." : "Cancel"}
          </button>
        )}
        {canComplete && (
          <button
            onClick={() => handleCompleteBooking(booking.id)}
            className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg transition-colors"
            title="Complete booking"
          >
            {isCompleting ? "Completing..." : "Complete"}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex-1 bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
                <BookingCard key={booking.id} booking={booking} canCancel={true} canComplete={user?.role === "PROVIDER" ? true : false} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Bookings */}
        {completedBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-600 rounded-full"></div>
              Completed Bookings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} canCancel={false} canComplete={false} />
              ))}
            </div>
          </div>
        )}
        {cancelledBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded-full"></div>
              Cancelled Bookings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} canCancel={false} canComplete={false} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings?.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start booking consultations with expert providers</p>
            <button
              onClick={() => { router.push('/providers') }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Providers
            </button>
          </div>
        )}
      </div>
    </div>

  )
}
