import { auth } from '../utils/auth.js';
import prisma from "../utils/db.js";
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export async function requireAuth(req, _, next) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            throw new ApiError(401, 'Unauthorized', 'You must be logged in');
        }

        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        throw new ApiError(401, 'Unauthorized', 'Invalid session');
    }
}

export function requireRole(...roles) {
    return async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers
            });

            if (!session) {
                throw new ApiError(401, 'Unauthorized', 'You must be logged in');
            }

            // Attach user to request
            req.user = session.user;
            req.session = session.session;

            // Fetch user from database to get the latest role info
            const user = await prisma.user.findUnique({
                where: { id: req.user.id }
            });


            if (!roles.includes(user.role)) {
                throw new ApiError(403, 'Forbidden', `This action requires one of these roles: ${roles.join(', ')}`);
            }

            next();
        } catch (error) {
            logger.error('Role check error:', error);
            throw new ApiError(403, 'Forbidden', 'Access denied');
        }
    };
}

