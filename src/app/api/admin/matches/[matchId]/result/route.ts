import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalculateAllRankings } from "@/services/scoring.service";

type Params = {
	params: Promise<{
		matchId: string;
	}>;
};

function getWinner(homeScore: number, awayScore: number) {
	if (homeScore > awayScore) return "HOME_TEAM";
	if (awayScore > homeScore) return "AWAY_TEAM";
	return "DRAW";
}

export async function PATCH(request: NextRequest, { params }: Params) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
		return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
	}

	try {
		const { matchId } = await params;
		const body = await request.json();

		const homeScore = Number(body.homeScore);
		const awayScore = Number(body.awayScore);

		if (Number.isNaN(homeScore) ||Number.isNaN(awayScore) ||homeScore < 0 ||awayScore < 0) {
			return NextResponse.json({ ok: false, error: "Pontuação inválida" }, { status: 400 });
		}

		const match = await prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				status: "FINISHED",
				homeScore,
				awayScore,
				winner: getWinner(homeScore, awayScore),
				lastSyncedAt: new Date(),
			},
		});

		const rankingResult = await recalculateAllRankings();

		return NextResponse.json({ ok: true, match, rankingResult });
	} catch (error) {
		return NextResponse.json({ ok: false, error: "Não foi possível atualizar o resultado do jogo", details: error instanceof Error ? error.message : "Erro desconhecido"}, { status: 500 });
	}
}