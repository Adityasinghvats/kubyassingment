import {
    createSlot,
    getSlots,
    getMySlots,
    deleteSlot
} from "../controllers/slot.controller";
import Router from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.post('/', requireAuth, requireRole('PROVIDER'), createSlot);
router.get('/my-slots', requireAuth, requireRole('PROVIDER'), getMySlots);
router.delete('/:id', requireAuth, requireRole('PROVIDER'), deleteSlot);
router.get('/:providerId', requireAuth, getSlots);

export default router;