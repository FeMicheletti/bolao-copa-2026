import { NextResponse } from "next/server";
import { getPoolInviteInfo } from "@/services/pool.service";

type Params = {
	params: Promise<{
		inviteCode: string;
	}>;
};

export async function GET(_: Request, { params }: Params) {
	try {
		const { inviteCode } = await params;

		const pool = await getPoolInviteInfo(inviteCode);

		return NextResponse.json({ ok: true, pool });
	} catch {
		return NextResponse.json({ ok: false, error: "Código de convite inválido" }, { status: 404 });
	}
}