"use client";

import MyBookingsPage from "@/components/my-bookings-page";
import { bookingAPI } from "@/services/bookingService";
import { useQuery } from "@tanstack/react-query";

export default function BookingsPage() {

    const bookingsData = useQuery({
        queryKey: ['bookings'],
        queryFn: () => bookingAPI.getBookings(),
    })

    const bookings = bookingsData.data?.data?.bookings || [];
    if (bookingsData.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading Bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <MyBookingsPage bookings={bookings} />
    );
}