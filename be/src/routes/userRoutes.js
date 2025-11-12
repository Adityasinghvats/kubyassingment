import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { prisma } from '../utils/db.js';

const router = express.Router();

/**
 * GET /api/users/me - Get current user profile
 */
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                hourlyRate: true,
                emailVerified: true,
                image: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

/**
 * PUT /api/users/me - Update current user profile
 */
router.put('/me', requireAuth, async (req, res) => {
    try {
        const { name, hourlyRate } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) })
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                hourlyRate: true,
                emailVerified: true,
                image: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * GET /api/users/providers - Get all providers (public)
 */
router.get('/providers', async (req, res) => {
    try {
        const providers = await prisma.user.findMany({
            where: { role: 'PROVIDER' },
            select: {
                id: true,
                name: true,
                hourlyRate: true,
                image: true,
                _count: {
                    select: {
                        slots: { where: { status: 'AVAILABLE' } }
                    }
                }
            }
        });

        res.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
});

export default router;
