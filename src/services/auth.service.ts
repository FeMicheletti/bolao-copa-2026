import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import type { LoginInput, RegisterInput } from "@/validations/auth.validation";

export async function registerUser(data: RegisterInput) {
	const existingUser = await prisma.user.findUnique({
		where: { email: data.email },
	});

	if (existingUser) throw new Error("EMAIL_ALREADY_EXISTS");

	const passwordHash = await bcrypt.hash(data.password, 10);

	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			passwordHash,
		},
		select: {
			id: true,
			name: true,
			email: true,
			avatarUrl: true,
			createdAt: true,
		},
	});

	const token = signJwt({ userId: user.id });

	return { user, token };
}

export async function loginUser(data: LoginInput) {
	const user = await prisma.user.findUnique({
		where: { email: data.email },
	});

	if (!user) throw new Error("INVALID_CREDENTIALS");

	const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

	if (!passwordMatches) throw new Error("INVALID_CREDENTIALS");

	const token = signJwt({ userId: user.id });

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			avatarUrl: user.avatarUrl,
			createdAt: user.createdAt,
		},
		token,
	};
}