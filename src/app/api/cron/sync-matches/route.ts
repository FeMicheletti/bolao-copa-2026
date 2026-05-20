import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");

	if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
		return NextResponse.json( { error: "Unauthorized" }, { status: 401 } );
	}

	return NextResponse.json({ ok: true, message: "Cron route working" });
}