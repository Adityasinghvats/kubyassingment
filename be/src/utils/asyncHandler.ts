import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    // return a new function which accepts req,res,next as input and return as a middleware
    return (req: Request, res: Response, next: NextFunction) => {
        // resolve it as promise if it is not async it will convert it into one
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
        // next(err) propagates the error to next middleware
    }
}
// async handler is used for avoiding repetitive try catch code

export { asyncHandler }