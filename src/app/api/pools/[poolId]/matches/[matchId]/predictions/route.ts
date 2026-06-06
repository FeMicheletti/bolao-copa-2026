import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { upsertPrediction, listMatchPredictions } from "@/services/prediction.service";
import { predictionSchema } from "@/validations/prediction.validation";

type Params = {
	params: Promise<{
		poolId: string;
		matchId: string;
	}>;
};

async function handleUpsert(request: NextRequest, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { poolId, matchId } = await params;
		const body = await request.json();

		const data = predictionSchema.parse({
			predictedHomeScore: Number(body.predictedHomeScore),
			predictedAwayScore: Number(body.predictedAwayScore),
		});

		const prediction = await upsertPrediction(poolId, matchId, user.id, data);

		return NextResponse.json({ ok: true, prediction });
	} catch (error) {
		if (error instanceof Error && error.message === "MATCH_ALREADY_STARTED") {
			return NextResponse.json({ ok: false, error: "Match already started" }, { status: 409 });
		}

		if (error instanceof Error && error.message === "MATCH_CLOSED") {
			return NextResponse.json({ ok: false, error: "Match is closed for predictions" }, { status: 409 });
		}

		if (error instanceof Error && error.message === "NOT_POOL_MEMBER") {
			return NextResponse.json({ ok: false, error: "You are not a member of this pool" }, { status: 403 });
		}

		return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
	}
}

export async function POST(request: NextRequest, context: Params) {
	return handleUpsert(request, context);
}

export async function PUT(request: NextRequest, context: Params) {
	return handleUpsert(request, context);
}

export async function GET(_: NextRequest, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
	}

	try {
		const { poolId, matchId } = await params;
		const predictions = await listMatchPredictions(poolId, matchId, user.id);

		return NextResponse.json({ ok: true, predictions });
	} catch (error) {
		if (error instanceof Error && error.message === "PREDICTIONS_HIDDEN") {
			return NextResponse.json({ ok: false, error: "Predições estão ocultas até o início do jogo" }, { status: 403 });
		}

		return NextResponse.json({ ok: false, error: "Não foi possível listar as previsões" }, { status: 400 });
	}
}