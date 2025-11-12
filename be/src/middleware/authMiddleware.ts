import { auth } from '../utils/auth';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export async function requireAuth(req: Request, _: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as Record<string, string | undefined>,
        });

        if (!session) {
            return next(new ApiError(401, 'Unauthorized', ['You must be logged in']));
        }

        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return next(new ApiError(401, 'Unauthorized', ['Invalid session']));
    }
}

export function requireRole(...roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new ApiError(403, 'Forbidden', ['User information is missing']));
            }

            if (!roles.includes(req.user.role)) {
                return next(new ApiError(403, 'Forbidden', [`This action requires one of these roles: ${roles.join(', ')}`]));
            }

            next();
        } catch (error) {
            logger.error('Role check error:', error);
            return next(new ApiError(403, 'Forbidden', ['Access denied']));
        }
    };
}

