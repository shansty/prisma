import { Role } from '@prisma/client'
import { z } from 'zod'
  

export const RegisterSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().optional(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string()
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddressId: z.number().optional(),
    defaultBillingAddressId: z.number().optional()
})

export const RoleSchema = z.object({
    role: z.enum([Role.ADMIN, Role.USER])
})