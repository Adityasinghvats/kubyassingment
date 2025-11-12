"use client"

import { useState } from "react"
import { ChevronLeft, Calendar, Clock, DollarSign } from "lucide-react"
import BookingModal from "./booking-modal"

interface Slot {
  id: string
  date: string
  time: string
  duration: number // in minutes
}

interface Provider {
  id: string
  name: string
  specialty: string
  hourlyRate: number
}

const mockProviders: Record<string, Provider> = {
  "1": { id: "1", name: "Dr. Sarah Anderson", specialty: "Business Strategy", hourlyRate: 150 },
  "2": { id: "2", name: "Mark Johnson", specialty: "Marketing & Growth", hourlyRate: 120 },
  "3": { id: "3", name: "Emma Wilson", specialty: "Financial Planning", hourlyRate: 180 },
  "4": { id: "4", name: "James Chen", specialty: "Tech Leadership", hourlyRate: 160 },
  "5": { id: "5", name: "Lisa Rodriguez", specialty: "HR & Recruitment", hourlyRate: 130 },
  "6": { id: "6", name: "David Kumar", specialty: "Sales Excellence", hourlyRate: 140 },
}

const generateSlots = (): Slot[] => {
  const slots: Slot[] = []
  const today = new Date()

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)
    const dateStr = date.toISOString().split("T")[0]

    const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]
    times.forEach((time, index) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time,
        duration: 30 + (index % 2) * 30, // 30 or 60 minutes
      })
    })
  }

  return slots
}

interface SlotsPageProps {
  providerId: string
  onBack: () => void
}

export default function SlotsPage({ providerId, onBack }: SlotsPageProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const provider = mockProviders[providerId]
  const allSlots = generateSlots()

  if (!provider) {
    return <div>Provider not found</div>
  }

  const groupedSlots: Record<string, Slot[]> = {}
  allSlots.forEach((slot) => {
    if (!groupedSlots[slot.date]) {
      groupedSlots[slot.date] = []
    }
    groupedSlots[slot.date].push(slot)
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const calculateCost = (duration: number, rate: number) => {
    return (duration / 60) * rate
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Providers
        </button>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-blue-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{provider.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-3">{provider.specialty}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-900 dark:text-white">${provider.hourlyRate}/hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slots */}
      <div className="space-y-8">
        {Object.entries(groupedSlots).map(([date, slots]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(date)}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot) => {
                const cost = calculateCost(slot.duration, provider.hourlyRate)
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">{slot.time}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{slot.duration} mins</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">${cost.toFixed(2)}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          provider={provider}
          cost={calculateCost(selectedSlot.duration, provider.hourlyRate)}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  )
}
