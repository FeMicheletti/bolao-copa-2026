import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { joinPoolByInviteCode } from "@/services/pool.service";

type Params = {
	params: Promise<{
		inviteCode: string;
	}>;
};

export async function POST(_: Request, { params }: Params) {
	const user = await getCurrentUser();

	if (!user) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

	try {
		const { inviteCode } = await params;

		const pool = await joinPoolByInviteCode(user.id, inviteCode);

		return NextResponse.json({ ok: true, pool });
	} catch (error) {
		if (error instanceof Error && error.message === "ALREADY_MEMBER") return NextResponse.json({ ok: false, error: "Você já é membro deste grupo" }, { status: 409 });

		return NextResponse.json({ ok: false, error: "Código de convite inválido" }, { status: 400 });
	}
}