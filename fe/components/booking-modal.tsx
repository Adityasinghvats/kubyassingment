"use client"

import { useState } from "react"
import { X, Calendar, Clock, DollarSign, CheckCircle } from "lucide-react"
import { Slot } from "@/interfaces/slot/interface"
import { User } from "@/interfaces/user/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "@/services/bookingService";


interface BookingModalProps {
  slot: Slot;
  provider?: User;
  cost: number;
  onClose: () => void
}

export default function BookingModal({ slot, provider, cost, onClose }: BookingModalProps) {
  const [isBooked, setIsBooked] = useState(false)
  const queryClient = useQueryClient();

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

  const handleBook = async () => {
    createBooking({ slotId: slot.id, finalCost: cost.toString() });
  }

  if (isBooked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-950 rounded-xl max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h2>
            <p className="text-slate-600 dark:text-slate-400">Your consultation has been successfully booked</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left space-y-3 border border-blue-200 dark:border-blue-800">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Provider</p>
              <p className="font-semibold text-slate-900 dark:text-white">{provider?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                <p className="font-semibold text-slate-900 dark:text-white">{slot.startTime}-{slot.endTime}</p>
              </div>

            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200 dark:border-blue-800">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                <p className="font-semibold text-slate-900 dark:text-white">{slot.duration} min</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Cost</p>
                <p className="font-semibold text-slate-900 dark:text-white">${cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
        className="bg-white dark:bg-slate-950 rounded-xl max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Booking Summary</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Info */}
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">Provider</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{provider?.name}</p>
            {/* <p className="text-sm text-slate-600 dark:text-slate-400">{provider.specialty}</p> */}
          </div>

          {/* Booking Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                <p className="font-semibold text-slate-900 dark:text-white">{slot.startTime}-{slot.endTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Time & Duration</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {slot.duration} minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-blue-200 dark:border-blue-800">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Cost</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Booking Message */}
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            You will receive a confirmation email with meeting details
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={isBooking}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isBooking ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
