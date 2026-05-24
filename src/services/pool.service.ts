import { prisma } from "@/lib/prisma";
import { generateInviteCode, slugify } from "@/lib/string";
import type { CreatePoolInput, JoinPoolInput } from "@/validations/pool.validation";

async function generateUniqueInviteCode() {
	let inviteCode = generateInviteCode();

	let existingPool = await prisma.pool.findUnique({
		where: { inviteCode },
	});

	while (existingPool) {
		inviteCode = generateInviteCode();

		existingPool = await prisma.pool.findUnique({ where: { inviteCode } });
	}

	return inviteCode;
}

async function generateUniqueSlug(name: string) {
	const baseSlug = slugify(name);
	let slug = baseSlug;
	let count = 1;

	let existingPool = await prisma.pool.findUnique({
		where: { slug },
	});

	while (existingPool) {
		slug = `${baseSlug}-${count}`;
		count++;

		existingPool = await prisma.pool.findUnique({
			where: { slug },
		});
	}

	return slug;
}

export async function createPool(userId: string, data: CreatePoolInput) {
	const slug = await generateUniqueSlug(data.name);
	const inviteCode = await generateUniqueInviteCode();

	const pool = await prisma.pool.create({
		data: {
			name: data.name,
			slug,
			inviteCode,
			ownerId: userId,
			members: {
				create: {
					userId,
					role: "OWNER",
				},
			},
			scores: {
				create: {
					userId,
					totalPoints: 0,
					exactScores: 0,
					correctResults: 0,
				},
			},
		},
		include: {
			owner: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			members: true,
		},
	});

	return pool;
}

export async function listUserPools(userId: string) {
	return prisma.pool.findMany({
		where: {
			members: {
				some: {
					userId,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			name: true,
			slug: true,
			inviteCode: true,
			isPrivate: true,
			createdAt: true,
			owner: {
				select: {
					id: true,
					name: true,
				},
			},
			_count: {
				select: {
					members: true,
				},
			},
		},
	});
}

export async function getPoolById(userId: string, poolId: string) {
	const membership = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId,
				userId,
			},
		},
	});

	if (!membership) throw new Error("POOL_NOT_FOUND");

	return prisma.pool.findUnique({
		where: {
			id: poolId,
		},
		include: {
			owner: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatarUrl: true,
						},
					},
				},
				orderBy: {
					joinedAt: "asc",
				},
			},
			scores: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
				orderBy: {
					totalPoints: "desc",
				},
			},
		},
	});
}

export async function joinPool(userId: string, data: JoinPoolInput) {
	const pool = await prisma.pool.findUnique({
		where: {
			inviteCode: data.inviteCode.toUpperCase(),
		},
	});

	if (!pool) throw new Error("INVALID_INVITE_CODE");

	const existingMember = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId: pool.id,
				userId,
			},
		},
	});

	if (existingMember) throw new Error("ALREADY_MEMBER");

	await prisma.poolMember.create({
		data: {
			poolId: pool.id,
			userId,
			role: "MEMBER",
		},
	});

	await prisma.score.create({
		data: {
			poolId: pool.id,
			userId,
			totalPoints: 0,
			exactScores: 0,
			correctResults: 0,
		},
	});

	return pool;
}

export async function getPoolInviteInfo(inviteCode: string) {
	const pool = await prisma.pool.findUnique({
		where: {
			inviteCode: inviteCode.toUpperCase(),
		},
		select: {
			id: true,
			name: true,
			slug: true,
			inviteCode: true,
			isPrivate: true,
			createdAt: true,
			owner: {
				select: {
					id: true,
					name: true,
				},
			},
			_count: {
				select: {
					members: true,
				},
			},
		},
	});

	if (!pool) throw new Error("INVALID_INVITE_CODE");

	return pool;
}

export async function joinPoolByInviteCode(userId: string,inviteCode: string) {
	return joinPool(userId, { inviteCode: inviteCode.toUpperCase() });
}

export async function regeneratePoolInviteCode(poolId: string,userId: string) {
	const member = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId,
				userId,
			},
		},
	});

	if (!member || !["OWNER", "ADMIN"].includes(member.role)) throw new Error("FORBIDDEN");

	const inviteCode = await generateUniqueInviteCode();

	return prisma.pool.update({
		where: {
			id: poolId,
		},
		data: {
			inviteCode,
		},
		select: {
			id: true,
			name: true,
			inviteCode: true,
		},
	});
}