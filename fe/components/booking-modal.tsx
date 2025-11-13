"use client"

import { useState } from "react"
import { X, Calendar, Clock, DollarSign, CheckCircle } from "lucide-react"
import { Slot } from "@/interfaces/slot/interface"
import { User } from "@/interfaces/user/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "@/services/bookingService";
import { formatDuration, formatDate, formatTime } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
interface BookingModalProps {
  slot: Slot;
  provider?: User;
  cost: number;
  onClose: () => void
}

export default function BookingModal({ slot, provider, cost, onClose }: BookingModalProps) {
  const [isBooked, setIsBooked] = useState(false)
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const { user } = useAuth()

  const { mutate: createBooking, isPending: isBooking } = useMutation({
    mutationFn: bookingAPI.addBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsBooked(true);
    },
    onError: (error: Error) => {
      console.error("Error creating booking request:", error);
      setIsBooked(false);
    },
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({ slotId: slot.id, finalCost: cost.toString(), description });
  }

  if (isBooked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-950 rounded-xl max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Booking Confirmed!</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your consultation has been successfully booked</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-left space-y-2 border border-blue-200 dark:border-blue-800">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Provider</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{provider?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Date</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(slot.startTime)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Time</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatTime(slot.startTime)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200 dark:border-blue-800">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Duration</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDuration(slot.duration)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Cost</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">${cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-950 rounded-xl max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Booking Summary</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Provider Info */}
          <div className="space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-400">Provider</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{provider?.name}</p>
          </div>

          {/* Booking Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Date</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(slot.startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Time & Duration</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({formatDuration(slot.duration)})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-blue-200 dark:border-blue-800">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Cost</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">${cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Additional Details (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any special requirements..."
              className="w-full px-2 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          {user?.role === 'CLIENT' && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={isBooking}
                className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBooking ? "Booking..." : "Book Now"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
