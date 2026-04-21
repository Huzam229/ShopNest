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

})

