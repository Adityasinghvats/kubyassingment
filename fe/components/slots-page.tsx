"use client"

import { useState } from "react"
import { ChevronLeft, Calendar, Clock, DollarSign } from "lucide-react"
import BookingModal from "./booking-modal"
import { useQuery } from "@tanstack/react-query"
import { slotAPI } from "@/services/slotService"
import { Slot } from "@/interfaces/slot/interface"
import { useRouter } from "next/navigation"

interface SlotsPageProps {
  providerId: string
}

export default function SlotsPage({ providerId }: SlotsPageProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const slotsData = useQuery({
    queryKey: ['slots', providerId],
    queryFn: () => slotAPI.getSlots(providerId),
  })
  const slots = slotsData.data?.data?.slots || [];

  const router = useRouter();

  const calculateCost = (duration: number, rate: number) => {
    return (duration / 60) * rate
  }

  return (
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

        {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-blue-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{ }</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-3">{provider.specialty}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-900 dark:text-white">${provider.hourlyRate}/hour</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Slots */}
      <div className="space-y-8">
        <div>
          {/* <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(date)}</h2>
            </div> */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot: Slot) => {
              const cost = calculateCost(slot.duration, slot.user?.hourlyRate ? parseFloat(slot.user.hourlyRate) : 0);
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{slot.duration / 60} hrs</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{slot.duration} mins</div>
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
  )
}
