import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    let error = err
    if (!(error instanceof ApiError)) {

        const statusCode = error.statusCode;

        const message = error.message || "Something went wrong"

        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack, errors: error.errors });

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    }

    return res.status(error.statusCode).json(response)
}

export { errorHandler }