import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { CartItem, Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "../main";
import { BadRequestsException } from "../exceptions/badRequests";
import { error } from "console";

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cartIsAlreadyExist = await prismaClient.cartItem.findFirst({
        where: {
            productId: product.id,
            userId: req.user.id
        }
    })
    let cart: CartItem;
    if(cartIsAlreadyExist) {
        res.json({message: "Cart already exist"})
    } else {
        cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user.id,
                productId: product.id,
                quantity: validatedData.quantity
            }
        })
        res.json(cart)
    }
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    const cartItem = await prismaClient.cartItem.findUnique({
        where: {
            id: +req.params.id
        },
        select: {
            userId: true
        }
    });

    const cartUserID = cartItem?.userId;
    if(!cartItem) {
        throw new BadRequestsException("Cart item not found", ErrorCode.CART_NOT_FOUND,error)
    } 
    if(cartUserID == req.user.id) {
        await prismaClient.cartItem.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json({message: "Item was delete"})
    } else {
        throw new BadRequestsException("You don't have permission for deleting", ErrorCode.NO_PERMISSIONS,error)
    }
}

export const changeQuantity = async (req: Request, res: Response) => {
    const cartItem = await prismaClient.cartItem.findUnique({
        where: {
            id: +req.params.id
        },
        select: {
            userId: true
        }
    });
    
    if(!cartItem) {
        throw new BadRequestsException("Cart item not found", ErrorCode.CART_NOT_FOUND,error)
    } 

    const cartUserID = cartItem?.userId;
    if(cartUserID == req.user.id) {
        const validatedData = ChangeQuantitySchema.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })
    res.json(updatedCart)
        res.json({message: "Item was delete"})
    } else {
        throw new BadRequestsException("You don't have permission for changing", ErrorCode.NO_PERMISSIONS,error)
    }
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    })
    res.json(cart)
}