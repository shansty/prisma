import { prismaClient } from "../main";
import { NextFunction, Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequests";
import { ErrorCode } from "../exceptions/root";
import { RegisterSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/notFound";
import { error } from "console";

export const register = async (req: Request, res: Response, next: NextFunction) => {
        RegisterSchema.parse(req.body);
        const {email, name, password} = req.body;
        let user = await prismaClient.user.findFirst({where: {email}});
        if(user) {
            throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXISTS, error)
        }
        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        })
        res.json(user)
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    let user = await prismaClient.user.findFirst({where: {email}});
    if(!user) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
    if(!compareSync(password, user.password)) {
        throw new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD, error)
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({user, token})
}

export const getCurrentUser = async (req: any, res: Response) => {

    res.json(req.user)
}