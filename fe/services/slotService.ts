const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
import { CreateSlotDTO } from "@/interfaces/slot/interface";

export const slotAPI = {
    getSlots: async (providerId: string) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/slots/${providerId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },

    addSlot: async (data: CreateSlotDTO) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/slots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Add slot failed');
        }

        return response.json();
    },

    getMySlots: async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/slots/my-slots`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },

    deleteSlotById: async (slotId: string) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/slots/${slotId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Delete slot failed');
        }

        return response.json();
    },
};