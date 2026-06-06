import { NextRequest, NextResponse } from "next/server";
import { recalculatePoolRanking } from "@/services/scoring.service";

type Params = {
	params: Promise<{
		poolId: string;
	}>;
};

export async function POST(request: NextRequest, { params }: Params) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

	try {
		const { poolId } = await params;
		const result = await recalculatePoolRanking(poolId);

		return NextResponse.json({ ok: true, result });
	} catch (error) {
		return NextResponse.json({ ok: false, error: "Não foi possível recalcular o ranking", details: error instanceof Error ? error.message : "Erro desconhecido" }, { status: 500 });
	}
}