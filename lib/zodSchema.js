import { z } from "zod";

const zSchema = z.object({
    email: z.email({
        message: "Invalid email format",
    }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[@$!%*?&]/, "Must contain at least one special character")
})

