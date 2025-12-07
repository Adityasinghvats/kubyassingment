import { Router } from "express";
import { createOrder, validatePayment } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/authMiddleware";
const router = Router();
router.post("/create", requireAuth, createOrder);
router.post("/validate", requireAuth, validatePayment);
export default router;