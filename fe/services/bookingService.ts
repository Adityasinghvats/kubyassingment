const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
import { CreateBookingDTO } from "@/interfaces/booking/interface";

export const bookingAPI = {
    getBookings: async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/bookings/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },

    addBooking: async (data: CreateBookingDTO) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Add booking failed');
        }

        return response.json();
    },

    completeBooking: async (bookingId: string) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${bookingId}/complete`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Complete booking failed');
        }

        return response.json();
    },

    cancelBooking: async (bookingId: string) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${bookingId}/cancel`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Cancel booking failed');
        }

        return response.json();
    },
};