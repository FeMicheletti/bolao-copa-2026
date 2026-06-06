export type ApiResponse<T> = {
	ok: boolean;
} & T;

export type PoolListItem = {
	id: string;
	name: string;
	slug: string;
	inviteCode: string;
	isPrivate: boolean;
	createdAt: string;
	owner: {
		id: string;
		name: string;
	};
	_count: {
		members: number;
	};
};

export type PoolDetails = {
	id: string;
	name: string;
	slug: string;
	inviteCode: string;
	isPrivate: boolean;
	createdAt: string;
	owner: {
		id: string;
		name: string;
		email: string;
	};
	members: {
		id: string;
		role: "OWNER" | "ADMIN" | "MEMBER";
		joinedAt: string;
		user: {
		id: string;
		name: string;
		email: string;
		avatarUrl: string | null;
		};
	}[];
};

export type PoolMatch = {
	id: string;
	externalId: string;
	homeTeam: string;
	awayTeam: string;
	homeTeamCode: string | null;
	awayTeamCode: string | null;
	utcDate: string;
	status: string;
	result: {
		home: number | null;
		away: number | null;
	};
	prediction: {
		home: number;
		away: number;
	} | null;
	points: number;
	pointsReason: string | null;
	canPredict: boolean;
	canSeePredictions: boolean;
	predictionsCount: number;
};

export type RankingItem = {
	id: string;
	poolId: string;
	userId: string;
	totalPoints: number;
	exactScores: number;
	correctResults: number;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		avatarUrl: string | null;
	};
};

export type PoolInviteInfo = {
	id: string;
	name: string;
	slug: string;
	inviteCode: string;
	isPrivate: boolean;
	createdAt: string;
	owner: {
		id: string;
		name: string;
	};
	_count: {
		members: number;
	};
};

export type MatchPrediction = {
	id: string;
	poolId: string;
	matchId: string;
	userId: string;
	predictedHomeScore: number;
	predictedAwayScore: number;
	points: number;
	pointsReason: string | null;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		avatarUrl: string | null;
	};
};