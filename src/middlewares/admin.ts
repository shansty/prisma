import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { PermissionException } from "../exceptions/permission-exeption";

const adminMiddleware = async(req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user.role == "ADMIN") {
        next()
    } else {
        next(new PermissionException("Only admin has permissions", ErrorCode.NO_PERMISSIONS))
    }
}

export default adminMiddleware;