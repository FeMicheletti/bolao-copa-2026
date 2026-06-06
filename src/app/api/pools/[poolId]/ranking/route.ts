import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPoolRanking } from "@/services/scoring.service";

type Params = {
	params: Promise<{
		poolId: string;
	}>;
};

export async function GET(_: Request, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

	try {
		const { poolId } = await params;
		const ranking = await getPoolRanking(poolId, user.id);

		return NextResponse.json({ ok: true, ranking });
	} catch {
		return NextResponse.json({ ok: false, error: "Não foi possível carregar o ranking" }, { status: 400 });
	}
}