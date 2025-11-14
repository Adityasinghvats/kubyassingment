import {
    createSlot,
    getSlots,
    getMySlots,
    deleteSlot
} from "../controllers/slot.controller";
import Router from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

/**
 * @openapi
 *  tags:
 *   name: Slots
 *   description: API for managing time slots
 *
 * /api/v1/slots:
 *   post:
 *     summary: Create a new slot
 *     description: Allows an authenticated provider to create a new available time slot.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSlotBody'
 *     responses:
 *       201:
 *         description: Slot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotCreationResponse'
 *       400:
 *         description: Bad Request - Missing required fields (startTime, endTime, duration) or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - No authentication token or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 */
router.post('/', requireAuth, requireRole('PROVIDER'), createSlot);

/**
 * @openapi
 *  /api/v1/slots/my-slots:
 *   get:
 *     summary: Get slots created by the authenticated provider
 *     description: Retrieves a list of all slots created by the currently authenticated user (provider). Includes associated booking and client details.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My slots fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MySlotsListResponse'
 *       401:
 *         description: Unauthorized - No authentication token or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 * 
 */
router.get('/my-slots', requireAuth, requireRole('PROVIDER'), getMySlots);
/** 
 * @openapi
 * /api/v1/slots/{id}:
 *   delete:
 *     summary: Delete a slot
 *     description: Allows an authenticated provider to delete one of their own available slots. Booked slots cannot be deleted.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The unique identifier of the slot to delete.
 *     responses:
 *       200:
 *         description: Slot deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       400:
 *         description: Bad Request - Cannot delete a booked slot.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - No authentication token or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - You can only delete your own slots.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Not Found - Slot ID is required or Slot not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/:id', requireAuth, requireRole('PROVIDER'), deleteSlot);
/**
 * @openapi
 *  /api/v1/slots/{providerId}:
 *   get:
 *     summary: Get slots for a specific provider
 *     description: Retrieves a list of slots for a given provider, with optional status filtering. Defaults to 'AVAILABLE' slots.
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The unique identifier of the provider whose slots are to be fetched.
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/SLOTSTATUS'
 *         required: false
 *         description: Filter slots by their status. Defaults to 'AVAILABLE'.
 *         example: AVAILABLE
 *     responses:
 *       200:
 *         description: Slots fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotsListResponse'
 *       400:
 *         description: Bad Request - Invalid status filter provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Not Found - ProviderId is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 */
router.get('/:providerId', requireAuth, getSlots);
/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ApiError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           format: int32
 *           example: 400
 *         message:
 *           type: string
 *           example: "Bad Request"
 *         success:
 *           type: boolean
 *           example: false
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Error detail 1", "Error detail 2"]
 *     ApiResponseSuccess:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           nullable: true
 *           example: null
 *         message:
 *           type: string
 *           example: "Slot deleted successfully"
 *         success:
 *           type: boolean
 *           example: true
 *     SLOTSTATUS:
 *       type: string
 *       enum:
 *         - AVAILABLE
 *         - BOOKED
 *       description: The current status of a time slot.
 *     BOOKINGSTATUS:
 *       type: string
 *       enum:
 *         - PENDING
 *         - COMPLETED
 *         - CANCELLED
 *       description: The current status of a booking.
 *     CreateSlotBody:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *         - duration
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the slot in ISO 8601 format.
 *           example: "2023-10-27T09:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the slot in ISO 8601 format.
 *           example: "2023-10-27T10:00:00Z"
 *         duration:
 *           type: integer
 *           description: The duration of the slot in minutes.
 *           example: 60
 *     ProviderDetailsForSlotCreation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         hourlyRate:
 *           type: number
 *           format: float
 *           nullable: true
 *     ProviderDetailsForSlotList:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         hourlyRate:
 *           type: number
 *           format: float
 *           nullable: true
 *         image:
 *           type: string
 *           nullable: true
 *     ClientDetailsForBooking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *     Slot:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         providerId:
 *           type: string
 *           format: uuid
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: integer
 *         status:
 *           $ref: '#/components/schemas/SLOTSTATUS'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SlotWithProviderForCreation:
 *       allOf:
 *         - $ref: '#/components/schemas/Slot'
 *         - type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/ProviderDetailsForSlotCreation'
 *     SlotWithProviderForList:
 *       allOf:
 *         - $ref: '#/components/schemas/Slot'
 *         - type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/ProviderDetailsForSlotList'
 *     BookingWithClient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         slotId:
 *           type: string
 *           format: uuid
 *         clientId:
 *           type: string
 *           format: uuid
 *         providerId:
 *           type: string
 *           format: uuid
 *         finalCost:
 *           type: number
 *           format: float
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/BOOKINGSTATUS'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         client:
 *           $ref: '#/components/schemas/ClientDetailsForBooking'
 *     SlotWithBookings:
 *       allOf:
 *         - $ref: '#/components/schemas/Slot'
 *         - type: object
 *           properties:
 *             bookings:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingWithClient'
 *     SlotCreationResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 201
 *         data:
 *           type: object
 *           properties:
 *             slot:
 *               $ref: '#/components/schemas/SlotWithProviderForCreation'
 *         message:
 *           type: string
 *           example: "Slot created successfully"
 *         success:
 *           type: boolean
 *           example: true
 *     SlotsListResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             slots:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SlotWithProviderForList'
 *         message:
 *           type: string
 *           example: "Slots fetched successfully"
 *         success:
 *           type: boolean
 *           example: true
 *     MySlotsListResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             slots:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SlotWithBookings'
 *         message:
 *           type: string
 *           example: "My slots fetched successfully"
 *         success:
 *           type: boolean
 *           example: true
 */

export default router;