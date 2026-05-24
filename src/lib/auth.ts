import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

export const AUTH_COOKIE_NAME = "bolao_token";

export async function getCurrentUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

	if (!token) return null;

	try {
		const payload = verifyJwt(token);

		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
			select: {
				id: true,
				name: true,
				email: true,
				avatarUrl: true,
				createdAt: true,
			},
		});

		return user;
	} catch {
		return null;
	}
}