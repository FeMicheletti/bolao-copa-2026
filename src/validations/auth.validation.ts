import { z } from "zod";

export const registerSchema = z.object({
	name: z
		.string()
		.min(2, "Name must have at least 2 characters")
		.max(80, "Name must have at most 80 characters"),

	email: z
		.email("Invalid email")
		.toLowerCase(),

	password: z
		.string()
		.min(6, "Password must have at least 6 characters")
		.max(100, "Password must have at most 100 characters"),
});

export const loginSchema = z.object({
	email: z
		.email("Invalid email")
		.toLowerCase(),

	password: z
		.string()
		.min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;