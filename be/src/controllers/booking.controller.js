import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/db.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createBooking = asyncHandler(async (req, res) => {
    const { slotId } = req.body;

    if (!slotId) {
        logger.error('Booking creation failed: slotId is required');
        throw new ApiError(400, 'slotId is required');
    }

    // Check if slot exists and is available
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: {
            user: true
        }
    });

    if (!slot) {
        logger.error(`Booking creation failed: Slot with ID ${slotId} not found`);
        throw new ApiError(404, 'Slot not found');
    }

    if (slot.status !== 'AVAILABLE') {
        logger.error(`Booking creation failed: Slot with ID ${slotId} is not available`);
        throw new ApiError(400, 'Slot is not available');
    }

    // Calculate final cost (hourlyRate * duration in hours)
    const durationInHours = slot.duration / 60;
    const finalCost = slot.user.hourlyRate * durationInHours;

    // Create booking and update slot in a transaction
    const booking = await prisma.$transaction(async (tx) => {
        // Update slot status
        await tx.slot.update({
            where: { id: slotId },
            data: { status: 'BOOKED' }
        });

        // Create booking
        return tx.booking.create({
            data: {
                slotId,
                clientId: req.user.id,
                providerId: slot.providerId,
                finalCost,
                status: 'PENDING'
            },
            include: {
                slot: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                hourlyRate: true
                            }
                        }
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    });

    res.status(201).json(new ApiResponse(201, { booking }, 'Booking created successfully'));

});


const getMyBookings = asyncHandler(async (req, res) => {
    const isClient = req.user.role === 'CLIENT';

    const bookings = await prisma.booking.findMany({
        where: isClient
            ? { clientId: req.user.id }
            : { providerId: req.user.id },
        include: {
            slot: true,
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    hourlyRate: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json(new ApiResponse(200, { bookings }, 'Bookings fetched successfully'));

});

const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
        where: { id }
    });

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    // Only client or provider can cancel
    if (booking.clientId !== req.user.id && booking.providerId !== req.user.id) {
        throw new ApiError(403, 'You can only cancel your own bookings');
    }

    if (booking.status === 'CANCELLED') {
        throw new ApiError(400, 'Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
        throw new ApiError(400, 'Cannot cancel a completed booking');
    }

    // Update booking and slot in transaction
    const updatedBooking = await prisma.$transaction(async (tx) => {
        // Update slot back to available
        await tx.slot.update({
            where: { id: booking.slotId },
            data: { status: 'AVAILABLE' }
        });

        // Update booking status
        return tx.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                slot: true,
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    });

    res.json(new ApiResponse(200, { booking: updatedBooking }, 'Booking cancelled successfully'));
});

const completeBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
        where: { id }
    });

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.providerId !== req.user.id) {
        throw new ApiError(403, 'You can only complete your own bookings');
    }

    if (booking.status === 'COMPLETED') {
        throw new ApiError(400, 'Booking is already completed');
    }

    if (booking.status === 'CANCELLED') {
        throw new ApiError(400, 'Cannot complete a cancelled booking');
    }

    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status: 'COMPLETED' },
        include: {
            slot: true,
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    res.json(new ApiResponse(200, { booking: updatedBooking }, 'Booking completed successfully'));

});

export {
    createBooking,
    getMyBookings,
    cancelBooking,
    completeBooking
}
