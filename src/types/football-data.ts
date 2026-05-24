export type FootballDataMatchStatus =
	| "SCHEDULED"
	| "TIMED"
	| "IN_PLAY"
	| "PAUSED"
	| "FINISHED"
	| "POSTPONED"
	| "SUSPENDED"
	| "CANCELLED";

export type FootballDataTeam = {
	id: number | null;
	name: string;
	shortName?: string;
	tla?: string;
	crest?: string;
};

export type FootballDataMatch = {
	id: number;
	utcDate: string;
	status: FootballDataMatchStatus;
	matchday: number | null;
	stage: string | null;
	group: string | null;
	homeTeam: FootballDataTeam;
	awayTeam: FootballDataTeam;
	score: {
		winner: string | null;
		duration: string;
		fullTime: {
			home: number | null;
			away: number | null;
		};
	};
};

export type FootballDataMatchesResponse = {
	resultSet: {
		count: number;
		first: string;
		last: string;
		played: number;
	};
	competition: {
		id: number;
		name: string;
		code: string;
		type: string;
	};
	matches: FootballDataMatch[];
};