import { prisma } from "@/lib/prisma";
import type { PredictionInput } from "@/validations/prediction.validation";

async function ensurePoolMember(poolId: string, userId: string) {
	const member = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId,
				userId,
			},
		},
	});

	if (!member) throw new Error("NOT_POOL_MEMBER");

	return member;
}

async function ensureMatchCanReceivePrediction(matchId: string) {
	const match = await prisma.match.findUnique({
		where: {
			id: matchId,
		},
	});

	if (!match) throw new Error("MATCH_NOT_FOUND");

	const now = new Date();

	if (match.utcDate <= now) throw new Error("MATCH_ALREADY_STARTED");

	if (["IN_PLAY", "PAUSED", "FINISHED", "CANCELLED", "POSTPONED"].includes(match.status)) throw new Error("MATCH_CLOSED");

	return match;
}

export async function upsertPrediction(poolId: string,matchId: string,userId: string,data: PredictionInput) {
	await ensurePoolMember(poolId, userId);
	await ensureMatchCanReceivePrediction(matchId);

	return prisma.prediction.upsert({
		where: {
			poolId_matchId_userId: {
				poolId,
				matchId,
				userId
			},
		},
		create: {
			poolId,
			matchId,
			userId,
			predictedHomeScore: data.predictedHomeScore,
			predictedAwayScore: data.predictedAwayScore
		},
		update: {
			predictedHomeScore: data.predictedHomeScore,
			predictedAwayScore: data.predictedAwayScore
		},
		include: {
			match: {
				select: {
					id: true,
					homeTeam: true,
					awayTeam: true,
					utcDate: true,
					status: true
				},
			},
		},
	});
}

export async function listMyPredictions(poolId: string, userId: string) {
	await ensurePoolMember(poolId, userId);

	return prisma.prediction.findMany({
		where: {
			poolId,
			userId
		},
		orderBy: {
			match: {
				utcDate: "asc"
			},
		},
		include: {
			match: {
				select: {
					id: true,
					homeTeam: true,
					awayTeam: true,
					homeTeamCode: true,
					awayTeamCode: true,
					utcDate: true,
					status: true,
					homeScore: true,
					awayScore: true,
					winner: true
				},
			},
		},
	});
}

export async function listMatchPredictions(poolId: string,matchId: string,userId: string) {
	await ensurePoolMember(poolId, userId);

	const match = await prisma.match.findUnique({
		where: {
			id: matchId,
		},
	});

	if (!match) throw new Error("MATCH_NOT_FOUND");

	const now = new Date();

	if (match.utcDate > now && !["IN_PLAY", "PAUSED", "FINISHED"].includes(match.status)) throw new Error("PREDICTIONS_HIDDEN");

	return prisma.prediction.findMany({
		where: {
			poolId,
			matchId
		},
		orderBy: {
			createdAt: "asc"
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true
				},
			},
		},
	});
}