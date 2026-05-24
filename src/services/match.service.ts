import { prisma } from "@/lib/prisma";

export async function listMatches() {
	return prisma.match.findMany({
		orderBy: {
			utcDate: "asc",
		},
		select: {
			id: true,
			externalId: true,
			competition: true,
			homeTeam: true,
			awayTeam: true,
			homeTeamCode: true,
			awayTeamCode: true,
			utcDate: true,
			status: true,
			homeScore: true,
			awayScore: true,
			winner: true,
			lastSyncedAt: true,
		},
	});
}