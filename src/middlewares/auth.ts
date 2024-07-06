import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "../main";

const authMiddleware = async(req: any, res: Response, next: NextFunction) => {
    //1. extract token from header
    const token = req.headers.authorization
    //2. if token is not present, throw an error 
    if(!token) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    } 
    try {
        //3. if token is present, verify token and extract the payload
        const payload = jwt.verify(token, JWT_SECRET) as any
        //4. to get the user from the payload
        const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
        if (!user) {
            next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
        }
        //5. to attach the user to the current request object
        req.user = user
        next()

    } catch(error) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }
}

export default authMiddleware;