import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listMatches } from "@/services/match.service";

export async function GET() {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Não autorizado" },{ status: 401 });
	}

	const matches = await listMatches();

	return NextResponse.json({ ok: true, matches });
}