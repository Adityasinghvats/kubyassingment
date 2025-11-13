import { Slot } from "../slot/interface";
import { User } from "../user/interface";

export interface Booking {
    id: string;
    slotId: string;
    clientId: string;
    providerId: string;
    finalCost: string;
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | string;
    createdAt: string;
    updatedAt: string;
    client: {
        id: string;
        name: string;
        email: string;
    };
    slot: Slot;
    provider: User;
}

export interface CreateBookingDTO {
    slotId: string;
    finalCost: string;
}