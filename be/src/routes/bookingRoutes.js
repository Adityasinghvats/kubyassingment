import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { prisma } from '../utils/db.js';

const router = express.Router();

/**
 * POST /api/bookings - Create a new booking (CLIENT only)
 */
router.post('/', requireRole('CLIENT'), async (req, res) => {
    try {
        const { slotId } = req.body;

        if (!slotId) {
            return res.status(400).json({ error: 'slotId is required' });
        }

        // Check if slot exists and is available
        const slot = await prisma.slot.findUnique({
            where: { id: slotId },
            include: {
                user: true
            }
        });

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (slot.status !== 'AVAILABLE') {
            return res.status(400).json({ error: 'Slot is not available' });
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

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

/**
 * GET /api/bookings/my-bookings - Get current user's bookings
 */
router.get('/my-bookings', requireAuth, async (req, res) => {
    try {
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

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

/**
 * PATCH /api/bookings/:id/cancel - Cancel a booking
 */
router.patch('/:id/cancel', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only client or provider can cancel
        if (booking.clientId !== req.user.id && booking.providerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only cancel your own bookings' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        if (booking.status === 'COMPLETED') {
            return res.status(400).json({ error: 'Cannot cancel a completed booking' });
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

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

/**
 * PATCH /api/bookings/:id/complete - Mark booking as completed (PROVIDER only)
 */
router.patch('/:id/complete', requireRole('PROVIDER'), async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.providerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only complete your own bookings' });
        }

        if (booking.status === 'COMPLETED') {
            return res.status(400).json({ error: 'Booking is already completed' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Cannot complete a cancelled booking' });
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

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error completing booking:', error);
        res.status(500).json({ error: 'Failed to complete booking' });
    }
});

export default router;
