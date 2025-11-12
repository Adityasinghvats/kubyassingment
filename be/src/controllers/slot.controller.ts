import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../utils/db";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response } from "express";

interface CreateSlotBody {
    startTime: string;
    endTime: string;
    duration: string;
}

interface GetSlotsQuery {
    providerId?: string;
    status?: string;
}


const createSlot = asyncHandler(async (req: Request<{}, {}, CreateSlotBody>, res: Response) => {
    const { startTime, endTime, duration } = req.body;

    if (!startTime || !endTime || !duration) {
        throw new ApiError(400, 'startTime, endTime, and duration are required');
    }

    const slot = await prisma.slot.create({
        data: {
            providerId: req.user.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            duration: parseInt(duration),
            status: 'AVAILABLE'
        },
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
    });

    res.status(201).json(new ApiResponse(201, { slot }, 'Slot created successfully'));
});

const getSlots = asyncHandler(async (req: Request<{}, {}, {}, GetSlotsQuery>, res: Response) => {
    const { status = 'AVAILABLE' } = req.query;
    const { providerId } = req.params;

    if (status && !['AVAILABLE', 'BOOKED'].includes(status)) {
        throw new ApiError(400, 'Invalid status filter');
    }
    if (!providerId) {
        throw new ApiError(404, 'ProviderId is required');

    }

    const slots = await prisma.slot.findMany({
        where: {
            ...(providerId && { providerId }),
            ...(status && { status: status as unknown as any })
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    hourlyRate: true,
                    image: true
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    res.json(new ApiResponse(200, { slots }, 'Slots fetched successfully'));

});


const getMySlots = asyncHandler(async (req: Request, res: Response) => {
    const slots = await prisma.slot.findMany({
        where: {
            providerId: req.user.id
        },
        include: {
            bookings: {
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            startTime: 'desc'
        }
    });

    res.json(new ApiResponse(200, { slots }, 'My slots fetched successfully'));
});


const deleteSlot = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(404, 'Slot ID is required');
    }

    // Check if slot exists and belongs to user
    const slot = await prisma.slot.findUnique({
        where: { id }
    });

    if (!slot) {
        throw new ApiError(404, 'Slot not found');
    }

    if (slot.providerId !== req.user.id) {
        throw new ApiError(403, 'You can only delete your own slots');
    }

    if (slot.status === 'BOOKED') {
        throw new ApiError(400, 'Cannot delete a booked slot');
    }

    await prisma.slot.delete({
        where: { id }
    });
    res.json(new ApiResponse(200, null, 'Slot deleted successfully'));
});

export {
    createSlot,
    getSlots,
    getMySlots,
    deleteSlot
}
