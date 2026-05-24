import type { FootballDataMatchesResponse } from "@/types/football-data";

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";

function getFootballDataToken() {
	const token = process.env.FOOTBALL_DATA_API_KEY;
	if (!token) throw new Error("FOOTBALL_DATA_API_KEY is not configured");
	return token;
}

type GetCompetitionMatchesParams = {
	competitionCode?: string;
	season?: number;
	dateFrom?: string;
	dateTo?: string;
	status?: string;
};

export async function getCompetitionMatches({ competitionCode = "WC", season, dateFrom, dateTo, status }: GetCompetitionMatchesParams = {}) {
	const params = new URLSearchParams();

	if (season) params.set("season", String(season));
	if (dateFrom) params.set("dateFrom", dateFrom);
	if (dateTo) params.set("dateTo", dateTo);
	if (status) params.set("status", status);

	const query = params.toString();
	const url = `${FOOTBALL_DATA_BASE_URL}/competitions/${competitionCode}/matches${query ? `?${query}` : ""}`;

	const response = await fetch(url, {
		headers: {
			"X-Auth-Token": getFootballDataToken(),
		},
		cache: "no-store",
	});

	if (!response.ok) {
		const text = await response.text();

		throw new Error(`FOOTBALL_DATA_ERROR: ${response.status} ${response.statusText} - ${text}`);
	}

	return response.json() as Promise<FootballDataMatchesResponse>;
}