import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPoolById } from "@/services/pool.service";

type Params = {
	params: Promise<{ poolId: string; }>;
};

export async function GET(_: Request, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
	}

	try {
		const { poolId } = await params;
		const pool = await getPoolById(user.id, poolId);

		return NextResponse.json({ ok: true, pool });
	} catch {
		return NextResponse.json({ ok: false, error: "Grupo não encontrado" }, { status: 404 });
	}
}