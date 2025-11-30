import {
    registerUser,
    getCurrentUser,
    updateCurrentUser,
    getProviders,
} from "../controllers/user.controller";
import Router from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { upload } from "../middleware/multerMiddleware";

const router = Router();

/**
 * @openapi
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Creates a new user account with role-based registration (CLIENT or PROVIDER)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegisterResponse'
 *       400:
 *         description: Bad request - Missing required fields or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.route('/register')
    .post(upload.single('profileImage'), registerUser);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Retrieves the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/me', requireAuth, getCurrentUser);

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         muultipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *       400:
 *         description: Bad request - Invalid update data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.route('/me')
    .patch(requireAuth, upload.single('profileImage'), updateCurrentUser);

/**
 * @openapi
 * /api/v1/users/providers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all providers
 *     description: Retrieves a list of all service providers with their available slots count
 *     responses:
 *       200:
 *         description: Providers list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProvidersListResponse'
 */
router.get('/providers', getProviders);

/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum:
 *         - PROVIDER
 *         - CLIENT
 *       description: The role of the user.
 *       example: CLIENT
 *
 *     CATEGORY:
 *       type: string
 *       enum:
 *         - PLUMBING
 *         - ELECTRICAL
 *         - CARPENTRY
 *         - CLEANING
 *         - TUTORING
 *         - CONSULTING
 *         - HEALTHCARE
 *         - LEGAL
 *         - OTHER
 *       description: The category of service a provider offers.
 *       example: OTHER
 *
 *     ApiErrorResponse:
 *       type: object
 *       required:
 *         - statusCode
 *         - message
 *         - success
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP status code.
 *           example: 400
 *         message:
 *           type: string
 *           description: A descriptive error message.
 *           example: Email, password, and name are required
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful.
 *           example: false
 *
 *     ApiResponseSuccess:
 *       type: object
 *       required:
 *         - statusCode
 *         - success
 *         - message
 *         - data
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP status code.
 *           example: 200
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful.
 *           example: true
 *         message:
 *           type: string
 *           description: A descriptive success message.
 *           example: User profile fetched successfully
 *         data:
 *           type: object
 *           description: The payload of the response.
 *
 *     UserRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password.
 *           minLength: 6
 *         name:
 *           type: string
 *           description: User's full name.
 *           example: John Doe
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           description: The role of the user. Defaults to CLIENT.
 *           example: CLIENT
 *         hourlyRate:
 *           type: number
 *           format: float
 *           description: Hourly rate for providers. Required if role is PROVIDER.
 *           nullable: true
 *           example: 50.00
 *         description:
 *           type: string
 *           description: A short description or bio for the user.
 *           nullable: true
 *           example: Experienced plumber with 10 years of service.
 *         category:
 *           $ref: '#/components/schemas/CATEGORY'
 *           description: The primary service category for providers. Defaults to OTHER.
 *           nullable: true
 *           example: PLUMBING
 *
 *     UserRegisterResult:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "clx0000000000000000000000"
 *             email:
 *               type: string
 *               format: email
 *               example: "user@example.com"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             role:
 *               $ref: '#/components/schemas/Role'
 *               example: "CLIENT"
 *
 *     UserRegisterResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/UserRegisterResult'
 *
 *     CurrentUserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "clx0000000000000000000000"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           example: "CLIENT"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Experienced plumber."
 *         category:
 *           $ref: '#/components/schemas/CATEGORY'
 *           nullable: true
 *           example: "PLUMBING"
 *         hourlyRate:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: 50.00
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         image:
 *           type: string
 *           nullable: true
 *           example: "http://example.com/avatar.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T12:00:00Z"
 *
 *     CurrentUserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/CurrentUserProfile'
 *
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name for the user.
 *           example: Jane Doe
 *         hourlyRate:
 *           type: number
 *           format: float
 *           description: New hourly rate for providers.
 *           example: 60.50
 *         description:
 *           type: string
 *           description: New description or bio for the user. Can be null to clear.
 *           nullable: true
 *           example: "Updated bio for the user."
 *         category:
 *           $ref: '#/components/schemas/CATEGORY'
 *           description: New service category for providers.
 *           example: ELECTRICAL
 *
 *     UpdatedUserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "clx0000000000000000000000"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           example: "PROVIDER"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Updated bio for the user."
 *         category:
 *           $ref: '#/components/schemas/CATEGORY'
 *           nullable: true
 *           example: "ELECTRICAL"
 *         hourlyRate:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: 60.50
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         image:
 *           type: string
 *           nullable: true
 *           example: "http://example.com/new_avatar.jpg"
 *
 *     UserUpdateResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UpdatedUserProfile'
 *
 *     ProviderCount:
 *       type: object
 *       properties:
 *         slots:
 *           type: integer
 *           description: Number of available slots for the provider.
 *           example: 5
 *
 *     ProviderProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "clx0000000000000000000000"
 *         name:
 *           type: string
 *           example: "Alice Smith"
 *         hourlyRate:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: 75.00
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Expert in electrical installations."
 *         category:
 *           $ref: '#/components/schemas/CATEGORY'
 *           nullable: true
 *           example: "ELECTRICAL"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "http://example.com/alice_avatar.jpg"
 *         _count:
 *           $ref: '#/components/schemas/ProviderCount'
 *
 *     ProvidersListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProviderProfile'
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;