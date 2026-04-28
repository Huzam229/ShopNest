import { z } from "zod";

export const zSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: z.email({
        message: "Invalid email format",
    }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[@$!%*?&]/, "Must contain at least one special character"),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),

    _id: z.string().min(3, '_id is required'),
    alt: z.string().min(3, 'alt is required, and have more than 3 characters'),
    title: z.string().min(3, 'title is required, and have more than 3 characters'),
    slug: z.string().min(3, 'Slug is required, and have more than 3 characters'),

    category: z.string().min(3, 'Category is required'),
    mrp: z.union([
        z.number().positive('Expected positive value, received negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),
    sellingPrice: z.union([
        z.number().positive('Expected positive value, received negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),
    discountPercentage: z.union([
        z.number().positive('Expected positive value, received negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),
    description:
        z.string().min(3, 'Description is required'),
    media: z.array(z.string()),
})

