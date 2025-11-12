import { auth } from '../utils/auth.js';


export async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to access this resource'
            });
        }

        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired session'
        });
    }
}

export function requireRole(...roles) {
    return async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers
            });

            if (!session) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'You must be logged in'
                });
            }

            // Attach user to request
            req.user = session.user;
            req.session = session.session;

            // Check role (you'll need to fetch full user from DB for role)
            // For now, we'll assume role is in session.user
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: `This action requires one of these roles: ${roles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid session'
            });
        }
    };
}

/**
 * Optional auth - attaches user if logged in, but doesn't require it
 */
export async function optionalAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (session) {
            req.user = session.user;
            req.session = session.session;
        }

        next();
    } catch (error) {
        // Continue even if auth fails
        next();
    }
}
