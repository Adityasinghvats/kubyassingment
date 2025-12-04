import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../utils/db";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/client";


const createBooking = asyncHandler(async (req: Request, res: Response) => {
    const { slotId, finalCost, description, paymentStatus } = req.body;

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

    let parsedFinalCost: Decimal | undefined = undefined;
    if (finalCost) {
        if (isNaN(parseFloat(finalCost))) {
            logger.error(`Slot booking failed: Invalid final cost ${finalCost}`);
            throw new ApiError(400, 'Invalid final cost specified');
        }
        parsedFinalCost = new Decimal(finalCost);
    }

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
                slotId: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                duration: slot.duration,
                clientId: req?.user.id,
                providerId: slot.providerId,
                paymentStatus: paymentStatus,
                finalCost: parsedFinalCost || new Decimal(0),
                status: 'PENDING',
                description: description || ''
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        hourlyRate: true,
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


const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    const isClient = req.user.role === 'CLIENT';

    const bookings = await prisma.booking.findMany({
        where: isClient
            ? { clientId: req.user.id }
            : { providerId: req.user.id },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json(new ApiResponse(200, { bookings }, 'Bookings fetched successfully'));

});

const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
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
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });
    });

    res.json(new ApiResponse(200, { booking: updatedBooking }, 'Booking cancelled successfully'));
});

const getBookingById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'Booking ID is required');
    }
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    hourlyRate: true,
                    phoneNumber: true,
                    category: true
                }
            }
        },
    })
    res.json(new ApiResponse(200, { booking }, 'Booking fetched successfully'));
});

const completeBooking = asyncHandler(async (req: Request, res: Response) => {
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

    const updatedBooking = await prisma.$transaction(async (tx) => {
        await tx.slot.delete({
            where: { id: booking.slotId },
        });
        await tx.booking.update({
            where: { id },
            data: { status: 'COMPLETED' },
            include: {
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
                        phoneNumber: true
                    }
                }
            }
        })
    })

    res.json(new ApiResponse(200, { booking: updatedBooking }, 'Booking completed successfully'));

});

export {
    createBooking,
    getMyBookings,
    cancelBooking,
    completeBooking,
    getBookingById
}
