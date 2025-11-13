import { Booking } from "../booking/interface";
import { User } from "../user/interface";
export interface Slot {
    id: string;
    providerId: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: 'BOOKED' | 'AVAILABLE' | string;
    createdAt: string;
    updatedAt: string;
    bookings?: Booking[];
    user?: User
}

export interface CreateSlotDTO {
    startTime: string;
    endTime: string;
    duration: string;
}