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
    return (
        <MyBookingsPage bookings={bookings} />
    );
}