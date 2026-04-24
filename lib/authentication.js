import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const isAuthenticated = async (role) => {
    try {
        const cookieStore = await cookies();

        if (!cookieStore.has("access-token")) {
            return { isAuth: false };
        }

        const access_token = cookieStore.get("access-token");

        const { payload } = await jwtVerify(
            access_token.value,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );

        if (payload.role !== role) {
            return { isAuth: false };
        }

        return {
            isAuth: true,
            userId: payload._id,
        };

    } catch (error) {
        return { isAuth: false };
    }
};
