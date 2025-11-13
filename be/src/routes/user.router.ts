import {
    registerUser,
    getCurrentUser,
    updateCurrentUser,
    getProviders,
} from "../controllers/user.controller";
import Router from "express";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post('/register', registerUser);
router.get('/me', requireAuth, getCurrentUser);
router.patch('/me', requireAuth, updateCurrentUser);
router.get('/providers', getProviders);

export default router;