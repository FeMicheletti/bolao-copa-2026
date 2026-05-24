import { z } from "zod";

export const createPoolSchema = z.object({
	name: z
		.string()
		.min(3, "Pool name must have at least 3 characters")
		.max(80, "Pool name must have at most 80 characters"),
});

export const joinPoolSchema = z.object({
	inviteCode: z
		.string()
		.min(4, "Invite code is required")
		.max(30, "Invalid invite code"),
});

export type CreatePoolInput = z.infer<typeof createPoolSchema>;
export type JoinPoolInput = z.infer<typeof joinPoolSchema>;