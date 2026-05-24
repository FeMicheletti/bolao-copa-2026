import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validations/auth.validation";
import { loginUser } from "@/services/auth.service";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const data = loginSchema.parse(body);

		const { user, token } = await loginUser(data);

		const response = NextResponse.json({ ok: true, user });

		response.cookies.set(AUTH_COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch {
		return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
	}
}