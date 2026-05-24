import { NextRequest, NextResponse } from "next/server";
import { syncWorldCupMatches } from "@/services/match-sync.service";
import { recalculateAllRankings } from "@/services/scoring.service";

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const syncResult = await syncWorldCupMatches();
		const rankingResult = await recalculateAllRankings();

		return NextResponse.json({ ok: true, message: "Matches synced and rankings recalculated successfully", result: { sync: syncResult, rankings: rankingResult }});
	} catch (error) {
		return NextResponse.json({ ok: false, error: "Failed to sync matches", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 } );
	}
}