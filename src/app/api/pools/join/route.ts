import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { joinPoolSchema } from "@/validations/pool.validation";
import { joinPool } from "@/services/pool.service";

export async function POST(request: NextRequest) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const data = joinPoolSchema.parse({ ...body, inviteCode: body.inviteCode?.toUpperCase() });

		const pool = await joinPool(user.id, data);

		return NextResponse.json({ ok: true, pool });
	} catch (error) {
		if (error instanceof Error && error.message === "ALREADY_MEMBER") {
			return NextResponse.json({ ok: false, error: "You are already a member of this pool" }, { status: 409 });
		}

		return NextResponse.json({ ok: false, error: "Invalid invite code" }, { status: 400 });
	}
}