import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createPoolSchema } from "@/validations/pool.validation";
import { createPool, listUserPools } from "@/services/pool.service";

export async function GET() {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json( { ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const pools = await listUserPools(user.id);

	return NextResponse.json({ ok: true, pools });
}

export async function POST(request: NextRequest) {
	const user = await getCurrentUser();

	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const data = createPoolSchema.parse(body);

		const pool = await createPool(user.id, data);

		return NextResponse.json({ ok: true, pool }, { status: 201 });
	} catch {
		return NextResponse.json({ ok: false, error: "Invalid request"}, { status: 400 });
	}
}