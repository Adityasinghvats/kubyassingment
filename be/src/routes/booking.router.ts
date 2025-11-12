import Router from 'express';
import {
    createBooking,
    getMyBookings,
    cancelBooking,
    completeBooking
} from '../controllers/booking.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, requireRole('CLIENT'), createBooking);
router.post('/:id/complete', requireAuth, requireRole('PROVIDER'), completeBooking);
router.get('/me', requireAuth, getMyBookings);
router.post('/:id/cancel', requireAuth, cancelBooking);

export default router;