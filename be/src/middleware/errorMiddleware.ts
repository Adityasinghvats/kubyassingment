import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

interface CustomError extends Error {
    statusCode?: number;
    errors?: string[];
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    let error = err
    if (!(error instanceof ApiError)) {

        const statusCode = error?.statusCode || 500;

        const message = error.message || "Something went wrong"

        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack, errors: error.errors });

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    }

    return res.status(error.statusCode || 500).json(response)
}

export { errorHandler }