import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpExeption } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exceptions";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/badRequests";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch(error: any) {
            let exception: HttpExeption;
            if(error instanceof HttpExeption) {
                exception = error;
            } else {
                if(error instanceof ZodError) {
                    exception = new BadRequestsException("Unprocessable entity", ErrorCode.UNPROCESSABLE_ENTITY, error)
                } else {
                    exception = new InternalException("Something went wrong", error, ErrorCode.INTERNAL_EXCEPTION)
                }
            }
            next(exception)
        }
    }
}