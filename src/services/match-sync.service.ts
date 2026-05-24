import { MatchStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCompetitionMatches } from "@/lib/football-data";
import type { FootballDataMatchStatus } from "@/types/football-data";

function mapMatchStatus(status: FootballDataMatchStatus): MatchStatus {
	const allowedStatuses: MatchStatus[] = [
		"SCHEDULED",
		"TIMED",
		"IN_PLAY",
		"PAUSED",
		"FINISHED",
		"POSTPONED",
		"CANCELLED",
	];

	if (allowedStatuses.includes(status as MatchStatus)) return status as MatchStatus;

	return "SCHEDULED";
}

function normalizeWinner(winner: string | null) {
	if (!winner) return null;

	if (winner === "HOME_TEAM") return "HOME_TEAM";
	if (winner === "AWAY_TEAM") return "AWAY_TEAM";
	if (winner === "DRAW") return "DRAW";

	return null;
}

function normalizeTeamName(name?: string | null) {
	return name?.trim() || "A definir";
}

function normalizeTeamCode(code?: string | null) {
	return code?.trim() || null;
}

export async function syncWorldCupMatches() {
	const startedAt = new Date();

	const syncLog = await prisma.syncLog.create({
		data: {
			source: "football-data.org",
			status: "RUNNING",
			startedAt,
		},
	});

	try {
		const response = await getCompetitionMatches({
			competitionCode: "WC",
			season: 2026,
		});

		let created = 0;
		let updated = 0;

		for (const match of response.matches) {
			const existingMatch = await prisma.match.findUnique({
				where: {
					externalId: String(match.id),
				},
				select: {
					id: true,
				},
			});

			await prisma.match.upsert({
				where: {
					externalId: String(match.id),
				},
				create: {
					externalId: String(match.id),
					competition: response.competition.code,
					homeTeam: normalizeTeamName(match.homeTeam?.name),
					awayTeam: normalizeTeamName(match.awayTeam?.name),
					homeTeamCode: normalizeTeamCode(match.homeTeam?.tla),
					awayTeamCode: normalizeTeamCode(match.awayTeam?.tla),
					utcDate: new Date(match.utcDate),
					status: mapMatchStatus(match.status),
					homeScore: match.score.fullTime.home,
					awayScore: match.score.fullTime.away,
					winner: normalizeWinner(match.score.winner),
					lastSyncedAt: new Date(),
				},
				update: {
					homeTeam: normalizeTeamName(match.homeTeam?.name),
					awayTeam: normalizeTeamName(match.awayTeam?.name),
					homeTeamCode: normalizeTeamCode(match.homeTeam?.tla),
					awayTeamCode: normalizeTeamCode(match.awayTeam?.tla),
					utcDate: new Date(match.utcDate),
					status: mapMatchStatus(match.status),
					homeScore: match.score.fullTime.home,
					awayScore: match.score.fullTime.away,
					winner: normalizeWinner(match.score.winner),
					lastSyncedAt: new Date(),
				},
			});

			if (existingMatch) {
				updated++;
			} else {
				created++;
			}
		}

		await prisma.syncLog.update({
			where: {
				id: syncLog.id,
			},
			data: {
				status: "SUCCESS",
				message: `Synced ${response.matches.length} matches. Created: ${created}. Updated: ${updated}.`,
				finishedAt: new Date(),
			},
		});

		return { count: response.matches.length, created, updated };
	} catch (error) {
		await prisma.syncLog.update({
			where: {
				id: syncLog.id,
			},
			data: {
				status: "ERROR",
				message: error instanceof Error ? error.message : "Unknown error",
				finishedAt: new Date(),
			},
		});

		throw error;
	}
}