import { Response, Request } from "express";
import { AddressSchema, RoleSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "../main";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/badRequests";
import { error } from "console";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body);

    const address = await prismaClient.address.create({
        data:{
            ...req.body,
            userId: req.user.id
        }
    })
    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json({message: "Address was delete"})
    } catch(err) {
        throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listOfAddresses = async (req: any, res: Response) => {
    const addressList = await prismaClient.address.findMany({
        where: {
            userId: req.user.id
        }
    })
    res.json(addressList)
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body);
    let shippingAddressId: Address;
    let billingAddressId: Address;

    if(validatedData.defaultShippingAddressId) {
        try{
            shippingAddressId = await prismaClient.address.findFirst({
                where: {
                    id: validatedData.defaultShippingAddressId
                }
            })
        } catch(err) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if(shippingAddressId?.userId != req.user.id) {
            throw new BadRequestsException("Address dosen't belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER, error)
        }
    }

    if(validatedData.defaultBillingAddressId) {
        try{
            billingAddressId = await prismaClient.address.findFirst({
                where: {
                    id: validatedData.defaultBillingAddressId
                }
            })
        } catch(err) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if(billingAddressId?.userId != req.user.id) {
            throw new BadRequestsException("Address doesn't belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER, error)
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    })

    res.json(updateUser)
}

export const listUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany({
        skip: +req.query.skip || 0,
        take: 10
    })
    res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
    try{
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true
            }
        })
        res.json(user)
    } catch(err) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    const validatedData = RoleSchema.parse(req.body)
    try{
        const user = await prismaClient.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: validatedData.role
            }
        })
        res.json(user)
    } catch(err) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
}