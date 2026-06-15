import { prisma } from "@/lib/prisma";

type CalculatePredictionPointsInput = {
	predictedHomeScore: number;
	predictedAwayScore: number;
	homeScore: number;
	awayScore: number;
};

type ScoreResult = {
	points: number;
	reason: string;
};

function getResult(homeScore: number, awayScore: number) {
	if (homeScore > awayScore) return "HOME_TEAM";
	if (awayScore > homeScore) return "AWAY_TEAM";
	return "DRAW";
}

function getGoalDifference(homeScore: number, awayScore: number) {
	return homeScore - awayScore;
}

export function calculatePredictionPoints({ predictedHomeScore, predictedAwayScore, homeScore, awayScore }: CalculatePredictionPointsInput): ScoreResult {
	const predictedResult = getResult(predictedHomeScore, predictedAwayScore);
	const realResult = getResult(homeScore, awayScore);

	const realGoalDifference = getGoalDifference(homeScore, awayScore);

	//* Placar exato: 25 pontos
	const exactScore = predictedHomeScore === homeScore && predictedAwayScore === awayScore;
	if (exactScore) return { points: 25, reason: "Placar exato" };

	const correctResult = predictedResult === realResult;

	const guessedAnyTeamScore = predictedHomeScore === homeScore || predictedAwayScore === awayScore;

	if (!correctResult) {
		//* Errou o resultado, mas acertou o placar de um dos times: 3 pontos
		if (guessedAnyTeamScore) return { points: 3, reason: "Acertou o placar de um time" };

		//* Errou o resultado e não acertou o placar de nenhum dos times: 0 pontos
		return { points: 0, reason: "Não pontuou" };
	}

	if (realResult === "DRAW") {
		return { points: 15, reason: "Acertou o empate" };
	}

	const winnerSide = realResult;

	//* Acertou o vencedor e os gols do vencedor: 18 pontos
	const guessedWinnerGoals = winnerSide === "HOME_TEAM" ? predictedHomeScore === homeScore : predictedAwayScore === awayScore;
	if (guessedWinnerGoals) return { points: 18, reason: "Acertou o vencedor e os gols do vencedor" };

	//* Acertou o vencedor e o saldo de gols: 15 pontos
	const predictedGoalDifference = getGoalDifference(predictedHomeScore, predictedAwayScore);
	if (predictedGoalDifference === realGoalDifference) return { points: 15, reason: "Acertou o vencedor e o saldo de gols" };

	//* Acertou o vencedor e os gols do perdedor: 12 pontos
	const guessedLoserGoals = winnerSide === "HOME_TEAM" ? predictedAwayScore === awayScore : predictedHomeScore === homeScore;
	if (guessedLoserGoals) return { points: 12, reason: "Acertou o vencedor e os gols do perdedor" };

	return { points: 6, reason: "Acertou o vencedor" };
}

export async function recalculatePoolRanking(poolId: string) {
	const finishedMatches = await prisma.match.findMany({
		where: {
			status: "FINISHED",
			homeScore: { not: null },
			awayScore: { not: null },
		},
		select: {
			id: true,
			homeScore: true,
			awayScore: true,
		}
	});

	const finishedMatchIds = finishedMatches.map((match) => match.id);

	if (finishedMatchIds.length === 0) {
		await prisma.score.updateMany({
			where: {
				poolId
			},
			data: {
				totalPoints: 0,
				exactScores: 0,
				correctResults: 0
			},
		});

		return { updatedPredictions: 0, updatedScores: 0 };
	}

	const predictions = await prisma.prediction.findMany({
		where: {
			poolId,
			matchId: { in: finishedMatchIds },
		},
		include: {
			match: {
				select: {
					homeScore: true,
					awayScore: true,
				},
			},
		},
	});

	let updatedPredictions = 0;

	for (const prediction of predictions) {
		if (prediction.match.homeScore === null || prediction.match.awayScore === null) continue;

		const result = calculatePredictionPoints({
			predictedHomeScore: prediction.predictedHomeScore,
			predictedAwayScore: prediction.predictedAwayScore,
			homeScore: prediction.match.homeScore,
			awayScore: prediction.match.awayScore,
		});

		const pointsReason = result.points === 0 ? "Não pontuou" : result.reason;

		await prisma.prediction.update({
			where: {
				id: prediction.id,
			},
			data: {
				points: Math.min(result.points, 25),
				pointsReason,
			},
		});

		updatedPredictions++;
	}

	const members = await prisma.poolMember.findMany({
		where: {
			poolId,
		},
		select: {
			userId: true,
		},
	});

	let updatedScores = 0;

	for (const member of members) {
		const userPredictions = await prisma.prediction.findMany({
			where: {
				poolId,
				userId: member.userId,
				matchId: { in: finishedMatchIds },
			},
			select: {
				points: true,
				pointsReason: true,
			},
		});

		const totalPoints = userPredictions.reduce( (sum, prediction) => sum + prediction.points, 0 );

		const exactScores = userPredictions.filter( (prediction) => prediction.pointsReason === "Placar exato" ).length;

		const correctResults = userPredictions.filter((prediction) =>
			[
				"Placar exato",
				"Acertou o vencedor e os gols do vencedor",
				"Acertou o vencedor e o saldo de gols",
				"Acertou o empate",
				"Acertou o vencedor e os gols do perdedor",
				"Acertou o vencedor",
				"Não pontuou",
			].includes(prediction.pointsReason ?? "")).length;

		await prisma.score.upsert({
			where: {
				poolId_userId: {
					poolId,
					userId: member.userId,
				},
			},
			create: {
				poolId,
				userId: member.userId,
				totalPoints,
				exactScores,
				correctResults,
			},
			update: {
				totalPoints,
				exactScores,
				correctResults,
			},
		});

		updatedScores++;
	}

	return { updatedPredictions, updatedScores };
}

export async function recalculateAllRankings() {
	const pools = await prisma.pool.findMany({
		select: {
			id: true,
		},
	});

	const results = [];

	for (const pool of pools) {
		const result = await recalculatePoolRanking(pool.id);
		results.push({ poolId: pool.id, ...result });
	}

	return results;
}

export async function getPoolRanking(poolId: string, userId: string) {
	const member = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId,
				userId,
			},
		},
	});

	if (!member) throw new Error("NOT_POOL_MEMBER");

	return prisma.score.findMany({
		where: {
			poolId,
		},
		orderBy: [
			{ totalPoints: "desc" },
			{ exactScores: "desc" },
			{ correctResults: "desc" },
			{ updatedAt: "asc" },
		],
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
	});
}