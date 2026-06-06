import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/services/auth.service";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const data = registerSchema.parse(body);

		const { user, token } = await registerUser(data);

		const response = NextResponse.json({ ok: true, user }, { status: 201 });

		response.cookies.set(AUTH_COOKIE_NAME, token, {
			httpOnly: true,
			// secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch (error) {
		if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
			return NextResponse.json({ ok: false, error: "Email já existente." }, { status: 409 });
		}

		return NextResponse.json({ ok: false, error: "Requisição inválida" }, { status: 400 });
	}
}