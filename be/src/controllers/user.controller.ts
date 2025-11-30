import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../utils/db";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { auth } from "../utils/auth";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { CATEGORY } from "../generated/prisma/enums";
import { deleteResource, uploadResource } from "../utils/cloudinary";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, role, hourlyRate, description, category, address, phoneNumber } = req.body;
    // const uploadFiles = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined;
    // const imageLocalPath = Array.isArray(uploadFiles) ? uploadFiles[0]?.path : uploadFiles?.profileImage?.[0]?.path;
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
        logger.error('User sign-up: Profile image is not provided');
    }
    let profileImageFile: any = null;
    if (imageLocalPath) {
        profileImageFile = await uploadResource(imageLocalPath);
    }

    if (!email || !password || !name || !address || !phoneNumber) {
        logger.error('User sign-up failed: Missing required fields');
        throw new ApiError(400, 'Email, password, name, address, and phone number are required');
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
    try {
        if (result.user) {
            await prisma.user.update({
                where: { id: result.user.id },
                data: {
                    hourlyRate: parsedHourlyRate,
                    description: description || null,
                    category: category || 'OTHER',
                    address,
                    phoneNumber,
                    image: profileImageFile ? profileImageFile.url : null
                }
            });
        }
    } catch (error) {
        logger.error(`User sign-up failed during profile creation: ${error}`);
        if (profileImageFile) {
            await deleteResource(profileImageFile.public_id);
        }
        return res.status(201).json(new ApiResponse(201, { result }, 'User registered successfully without profile details'));
    }

    return res.status(201).json(new ApiResponse(201, { result }, 'User registered successfully'));
})

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            address: true,
            name: true,
            role: true,
            description: true,
            rating: true,
            category: true,
            hourlyRate: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            _count: {
                select: {
                    slots: true,
                    bookingsReceived: true,
                    bookingsMade: true
                }
            }
        }
    });

    if (!user) {
        logger.error(`User not found: ID ${req.user.id}`);
        throw new ApiError(404, 'User not found');
    }
    return res.json(new ApiResponse(200, { user }, 'User profile fetched successfully'));

})

const updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, hourlyRate, description, category, address, phoneNumber } = req.body;

    // const uploadFiles = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined;
    // const imageLocalPath = Array.isArray(uploadFiles) ? uploadFiles[0]?.path : uploadFiles?.profileImage?.[0]?.path;
    const imageLocalPath = req.file?.path;
    let oldImagePublicId: string | null = null;
    if (!imageLocalPath) {
        logger.error('User sign-up: Profile image is not provided');
    }
    let profileImageFile: any = null;

    if (hourlyRate && isNaN(parseFloat(hourlyRate))) {
        logger.error(`User profile update failed: Invalid hourly rate ${hourlyRate}`);
        throw new ApiError(400, 'Invalid hourly rate specified');
    }

    if (imageLocalPath) {
        try {
            // Get old image URL to delete later
            const currentUser = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { image: true }
            });

            if (currentUser?.image) {
                // Extract public_id from Cloudinary URL
                const urlParts = currentUser.image.split('/');
                const fileName = urlParts[urlParts.length - 1];
                oldImagePublicId = fileName.split('.')[0];
            }

            profileImageFile = await uploadResource(imageLocalPath);
        } catch (error) {
            logger.error(`Failed to upload profile image: ${error}`);
            throw new ApiError(500, 'Failed to upload profile image');
        }
    }

    let updatedUser: any;
    try {
        updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
                ...(description !== undefined && { description }),
                ...(category && { category }),
                ...(address && { address }),
                ...(phoneNumber && { phoneNumber }),
                ...(profileImageFile && { image: profileImageFile.url })
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                description: true,
                category: true,
                hourlyRate: true,
                emailVerified: true,
                address: true,
                phoneNumber: true,
                image: true
            }
        });
        if (oldImagePublicId && profileImageFile) {
            await deleteResource(oldImagePublicId).catch(err =>
                logger.warn(`Failed to delete old image: ${err}`)
            );
        }
    } catch (error) {
        logger.error(`User profile update failed: ${error}`);
        if (profileImageFile) {
            await deleteResource(profileImageFile.public_id);
        }
        throw new ApiError(500, 'Failed to update user profile');
    }
    return res.json(new ApiResponse(200, { user: updatedUser }, 'User profile updated successfully'));
});

const getProviders = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.query;
    const providers = await prisma.user.findMany({
        where: { role: 'PROVIDER', ...(category && { category: category as CATEGORY }) },
        select: {
            id: true,
            name: true,
            hourlyRate: true,
            description: true,
            category: true,
            image: true,
            rating: true,
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
