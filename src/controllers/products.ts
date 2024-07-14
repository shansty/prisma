import { Request, Response } from "express";
import { prismaClient } from "../main";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export const addProduct = async(req: Request, res: Response) => {

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(", ")
        }
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    try{
        const product = req.body;
        if(product.tags) {
            product.tags = product.tags.join(", ")
        }
        const updateProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })
        res.json(updateProduct)

    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.delete({
        where: {
            id: +req.params.id
        }
    })
    if(!product) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
    res.json({message: `Product ${product.name} with id ${product.id} was delete`})
}

export const listProducts = async (req: Request, res: Response) => {
    const count = await prismaClient.product.count();
    const skip = req.query.skip ? +req.query.skip : 0;
    const products = await prismaClient.product.findMany({
        skip,
        take: 10
    })
    res.json({
        count, data:products
    })
}

export const getProductById = async (req: Request, res: Response) => {
    try{
        const product = await prismaClient.product.findFirst({
            where: {
                id: +req.params.id
            }
        })
        if(product) {
            res.json(product)
        } else {
            throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
        }
        
    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const result = await prismaClient.product.findMany({
        where: {
          description: {
            search: 'nice',
          },
        },
      })
      res.json(result)
    
}