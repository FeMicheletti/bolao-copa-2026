import { prisma } from "@/lib/prisma";

export async function listPoolMatches(poolId: string, userId: string) {
	const member = await prisma.poolMember.findUnique({
		where: {
			poolId_userId: {
				poolId,
				userId
			}
		}
	});

	if (!member) throw new Error("NOT_POOL_MEMBER");

	const matches = await prisma.match.findMany({
		orderBy: {
			utcDate: "asc"
		},
		include: {
			predictions: {
				where: {
					userId
				},
				select: {
					predictedHomeScore:true,
					predictedAwayScore:true,
					points:true,
					pointsReason:true
				}
			},
			_count:{
				select:{
					predictions:{
						where:{
							poolId
						}
					}
				}
			}
		}
	});

	const now = new Date();

	return matches.map(match=>{
		const prediction = match.predictions[0];

		const canPredict = match.utcDate>now && !["IN_PLAY", "PAUSED", "FINISHED", "POSTPONED", "CANCELLED"].includes(match.status);

		const canSeePredictions = match.utcDate<=now || ["IN_PLAY", "PAUSED", "FINISHED"].includes(match.status);

		return{
			id: match.id,
			externalId: match.externalId,
			homeTeam: match.homeTeam,
			awayTeam: match.awayTeam,
			homeTeamCode: match.homeTeamCode,
			awayTeamCode: match.awayTeamCode,
			utcDate: match.utcDate,
			status: match.status,
			result: {
				home: match.homeScore,
				away: match.awayScore
			},
			prediction: prediction ? {
				home: prediction.predictedHomeScore,
				away: prediction.predictedAwayScore
			} : null,
			points: prediction?.points ??0,
			pointsReason: prediction?.pointsReason ??null,
			canPredict,
			canSeePredictions,
			predictionsCount: match._count.predictions
		};
	});
}