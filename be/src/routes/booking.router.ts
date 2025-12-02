import Router from 'express';
import {
    createBooking,
    getMyBookings,
    cancelBooking,
    completeBooking,
    getBookingById
} from '../controllers/booking.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Bookings
 *   description: Booking management operations
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserPartial:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *       required:
 *         - id
 *         - name
 *         - email
 *     UserWithHourlyRatePartial:
 *       allOf:
 *         - $ref: '#/components/schemas/UserPartial'
 *         - type: object
 *           properties:
 *             hourlyRate:
 *               type: number
 *               format: float
 *               description: The hourly rate of the provider.
 *               nullable: true
 *     SLOTSTATUS:
 *       type: string
 *       enum:
 *         - AVAILABLE
 *         - BOOKED
 *       description: The status of a time slot.
 *     Slot:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the slot.
 *         providerId:
 *           type: string
 *           format: uuid
 *           description: The ID of the provider who owns the slot.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the slot.
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the slot.
 *         duration:
 *           type: integer
 *           description: The duration of the slot in minutes.
 *         status:
 *           $ref: '#/components/schemas/SLOTSTATUS'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the slot was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the slot was last updated.
 *       required:
 *         - id
 *         - providerId
 *         - startTime
 *         - endTime
 *         - duration
 *         - status
 *         - createdAt
 *         - updatedAt
 *     SlotWithProvider:
 *       allOf:
 *         - $ref: '#/components/schemas/Slot'
 *         - type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserWithHourlyRatePartial'
 *               description: The provider associated with the slot.
 *           required:
 *             - user
 *     BOOKINGSTATUS:
 *       type: string
 *       enum:
 *         - PENDING
 *         - COMPLETED
 *         - CANCELLED
 *       description: The status of a booking.
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the booking.
 *         slotId:
 *           type: string
 *           format: uuid
 *           description: The ID of the booked slot.
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: The ID of the client who made the booking.
 *         providerId:
 *           type: string
 *           format: uuid
 *           description: The ID of the provider for the booking.
 *         finalCost:
 *           type: number
 *           format: float
 *           description: The final cost of the booking.
 *         description:
 *           type: string
 *           nullable: true
 *           description: A description for the booking.
 *         status:
 *           $ref: '#/components/schemas/BOOKINGSTATUS'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the booking was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the booking was last updated.
 *         slot:
 *           $ref: '#/components/schemas/SlotWithProvider'
 *           description: The details of the booked slot, including provider information.
 *         client:
 *           $ref: '#/components/schemas/UserPartial'
 *           description: The details of the client who made the booking.
 *         provider:
 *           $ref: '#/components/schemas/UserWithHourlyRatePartial'
 *           description: The details of the provider for the booking.
 *       required:
 *         - id
 *         - slotId
 *         - clientId
 *         - providerId
 *         - finalCost
 *         - status
 *         - createdAt
 *         - updatedAt
 *     CreateBookingRequest:
 *       type: object
 *       properties:
 *         slotId:
 *           type: string
 *           format: uuid
 *           description: The ID of the slot to book.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         finalCost:
 *           type: number
 *           format: float
 *           description: The final agreed cost for the booking.
 *           nullable: true
 *           example: 50.00
 *         description:
 *           type: string
 *           description: An optional description for the booking.
 *           nullable: true
 *           example: "Need help with a leaky faucet."
 *       required:
 *         - slotId
 *     ApiResponseBooking:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             booking:
 *               $ref: '#/components/schemas/Booking'
 *         message:
 *           type: string
 *           example: "Booking created successfully"
 *       required:
 *         - statusCode
 *         - data
 *         - message
 *     ApiResponseBookingsArray:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             bookings:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *         message:
 *           type: string
 *           example: "Bookings fetched successfully"
 *       required:
 *         - statusCode
 *         - data
 *         - message
 *     ApiError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Error message"
 *       required:
 *         - statusCode
 *         - message
 *
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Allows an authenticated client to create a booking for an available slot.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseBooking'
 *       400:
 *         description: Bad request (e.g., slotId missing, slot not available, invalid final cost).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               slotIdRequired:
 *                 value:
 *                   statusCode: 400
 *                   message: "slotId is required"
 *               slotNotAvailable:
 *                 value:
 *                   statusCode: 400
 *                   message: "Slot is not available"
 *               invalidFinalCost:
 *                 value:
 *                   statusCode: 400
 *                   message: "Invalid final cost specified"
 *       401:
 *         description: Unauthorized (authentication required).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden (e.g., user is not a client).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Not Found (e.g., slot not found).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               slotNotFound:
 *                 value:
 *                   statusCode: 404
 *                   message: "Slot not found"
*/
router.post('/', requireAuth, requireRole('CLIENT'), createBooking);
/**
 * @openapi
 * /api/v1/bookings/{id}/complete:
 *   patch:
 *     summary: Complete a booking
 *     description: Allows the provider of a booking to mark it as 'COMPLETED'.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the booking to complete.
 *         example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *     responses:
 *       200:
 *         description: Booking completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseBooking'
 *       400:
 *         description: Bad request (e.g., booking already completed or cancelled).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               alreadyCompleted:
 *                 value:
 *                   statusCode: 400
 *                   message: "Booking is already completed"
 *               cannotCompleteCancelled:
 *                 value:
 *                   statusCode: 400
 *                   message: "Cannot complete a cancelled booking"
 *       401:
 *         description: Unauthorized (authentication required).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden (e.g., user is not the provider of the booking).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notProvider:
 *                 value:
 *                   statusCode: 403
 *                   message: "You can only complete your own bookings"
 *       404:
 *         description: Not Found (e.g., booking not found).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               bookingNotFound:
 *                 value:
 *                   statusCode: 404
 *                   message: "Booking not found"
 */
router.post('/:id/complete', requireAuth, requireRole('PROVIDER'), completeBooking);
/**
 * @openapi
 *  /api/v1/bookings:
 *   get:
 *     summary: Get bookings for the authenticated user
 *     description: Retrieves a list of bookings where the authenticated user is either the client or the provider.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseBookingsArray'
 *       401:
 *         description: Unauthorized (authentication required).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 * 
 */
router.get('/me', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
/**
 * @openapi
 * /api/v1/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     description: Allows the client or provider of a booking to cancel it. The associated slot status is reverted to 'AVAILABLE'.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the booking to cancel.
 *         example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseBooking'
 *       400:
 *         description: Bad request (e.g., booking already cancelled or completed).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               alreadyCancelled:
 *                 value:
 *                   statusCode: 400
 *                   message: "Booking is already cancelled"
 *               cannotCancelCompleted:
 *                 value:
 *                   statusCode: 400
 *                   message: "Cannot cancel a completed booking"
 *       401:
 *         description: Unauthorized (authentication required).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden (e.g., user is not the client or provider of the booking).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notOwner:
 *                 value:
 *                   statusCode: 403
 *                   message: "You can only cancel your own bookings"
 *       404:
 *         description: Not Found (e.g., booking not found).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               bookingNotFound:
 *                 value:
 *                   statusCode: 404
 *                   message: "Booking not found"
 *
 */
router.post('/:id/cancel', requireAuth, cancelBooking);

export default router;