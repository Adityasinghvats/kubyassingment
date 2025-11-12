import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../utils/db";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { auth } from "../utils/auth";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, role, hourlyRate } = req.body;

    if (!email || !password || !name) {
        logger.error('User sign-up failed: Missing required fields');
        throw new ApiError(400, 'Email, password, and name are required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        logger.error(`User sign-up failed: User with email ${email} already exists`);
        throw new ApiError(400, 'User already exists');
    }

    if (role && !['CLIENT', 'PROVIDER'].includes(role)) {
        logger.error(`User sign-up failed: Invalid role ${role}`);
        throw new ApiError(400, 'Invalid role specified');
    }

    let parsedHourlyRate: Decimal | undefined = undefined;
    if (hourlyRate) {
        if (isNaN(parseFloat(hourlyRate))) {
            logger.error(`User sign-up failed: Invalid hourly rate ${hourlyRate}`);
            throw new ApiError(400, 'Invalid hourly rate specified');
        }
        parsedHourlyRate = new Decimal(hourlyRate);
    }

    // first create user in better-auth
    const result = await auth.api.signUpEmail({
        body: { email, password, name, role }
    })

    // add additional fields in our own database
    if (result.user) {
        await prisma.user.update({
            where: { id: result.user.id },
            data: {
                hourlyRate: parsedHourlyRate
            }
        });
    }

    return res.status(201).json(new ApiResponse(201, { result }, 'User registered successfully'));
})

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
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
        logger.error(`User not found: ID ${req.user.id}`);
        throw new ApiError(404, 'User not found');
    }
    return res.json(new ApiResponse(200, { user }, 'User profile fetched successfully'));

})

const updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, hourlyRate } = req.body;

    if (hourlyRate && isNaN(parseFloat(hourlyRate))) {
        logger.error(`User profile update failed: Invalid hourly rate ${hourlyRate}`);
        throw new ApiError(400, 'Invalid hourly rate specified');
    }

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
    return res.json(new ApiResponse(200, { user: updatedUser }, 'User profile updated successfully'));
});

const getProviders = asyncHandler(async (req: Request, res: Response) => {
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

    res.json(new ApiResponse(200, { providers }, 'Providers fetched successfully'));
});


export {
    registerUser,
    getCurrentUser,
    updateCurrentUser,
    getProviders
}
