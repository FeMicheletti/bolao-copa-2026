import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listMyPredictions } from "@/services/prediction.service";

type Params = {
	params: Promise<{ poolId: string; }>;
};

export async function GET(_: Request, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { poolId } = await params;
		const predictions = await listMyPredictions(poolId, user.id);

		return NextResponse.json({ ok: true, predictions });
	} catch {
		return NextResponse.json({ ok: false, error: "Could not list predictions" }, { status: 400 });
	}
}