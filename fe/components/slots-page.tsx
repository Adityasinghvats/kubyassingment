"use client"

import { useState } from "react"
import { ChevronLeft, Calendar, Clock, DollarSign } from "lucide-react"
import BookingModal from "./booking-modal"
import { useQuery } from "@tanstack/react-query"
import { slotAPI } from "@/services/slotService"
import { Slot } from "@/interfaces/slot/interface"
import { useRouter } from "next/navigation"
import { formatDate, formatDuration, formatTime } from "@/lib/format"
import { User } from "@/interfaces/user/interface"
import { useRequireAuth } from "@/hooks/use-auth"

interface SlotsPageProps {
  providerId: string
}

export default function SlotsPage({ providerId }: SlotsPageProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const router = useRouter();
  const { session } = useRequireAuth();
  if (!session) {
    return null;
  }
  const slotsData = useQuery({
    queryKey: ['slots', providerId],
    queryFn: () => slotAPI.getSlots(providerId),
  })
  const slots = slotsData.data?.data?.slots || [];
  const calculateCost = (duration: number, rate: number) => {
    return (duration / 60) * rate
  }
  const provider: User = slots.length > 0 ? slots[0].user : null;
  if (slotsData.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading slots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/providers')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Providers
          </button>

          {provider && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-blue-200 dark:border-slate-700">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{provider?.name}</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{provider?.category}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{provider?.hourlyRate}/hour</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slots */}
        <div className="space-y-8">
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot: Slot) => {
                const cost = calculateCost(slot.duration, slot.user?.hourlyRate ? parseFloat(slot.user.hourlyRate) : 0);
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(slot.startTime)}</h2>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{formatDuration(slot.duration)}</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">${cost.toFixed(2)}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        {/* Booking Modal */}
        {selectedSlot && (
          <BookingModal
            slot={selectedSlot}
            provider={selectedSlot.user}
            cost={calculateCost(selectedSlot.duration, selectedSlot.user?.hourlyRate ? parseFloat(selectedSlot.user.hourlyRate) : 0)}
            onClose={() => setSelectedSlot(null)}
          />
        )}
      </div>
    </div>
  )
}
