import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { prisma } from '../utils/db.js';

const router = express.Router();

/**
 * POST /api/slots - Create a new slot (PROVIDER only)
 */
router.post('/', requireRole('PROVIDER'), async (req, res) => {
    try {
        const { startTime, endTime, duration } = req.body;

        // Validation
        if (!startTime || !endTime || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: startTime, endTime, duration'
            });
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

        res.status(201).json(slot);
    } catch (error) {
        console.error('Error creating slot:', error);
        res.status(500).json({ error: 'Failed to create slot' });
    }
});

/**
 * GET /api/slots - Get all available slots
 */
router.get('/', async (req, res) => {
    try {
        const { providerId, status = 'AVAILABLE' } = req.query;

        const slots = await prisma.slot.findMany({
            where: {
                ...(providerId && { providerId }),
                ...(status && { status })
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

        res.json(slots);
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
});

/**
 * GET /api/slots/my-slots - Get current user's slots (PROVIDER only)
 */
router.get('/my-slots', requireRole('PROVIDER'), async (req, res) => {
    try {
        const slots = await prisma.slot.findMany({
            where: {
                providerId: req.user.id
            },
            include: {
                booking: {
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

        res.json(slots);
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
});

/**
 * DELETE /api/slots/:id - Delete a slot (PROVIDER only, own slots)
 */
router.delete('/:id', requireRole('PROVIDER'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if slot exists and belongs to user
        const slot = await prisma.slot.findUnique({
            where: { id }
        });

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (slot.providerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own slots' });
        }

        if (slot.status === 'BOOKED') {
            return res.status(400).json({ error: 'Cannot delete a booked slot' });
        }

        await prisma.slot.delete({
            where: { id }
        });

        res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting slot:', error);
        res.status(500).json({ error: 'Failed to delete slot' });
    }
});

export default router;
