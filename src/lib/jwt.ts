import jwt from "jsonwebtoken";

type JwtPayload = {
	userId: string;
};

const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error("JWT_SECRET is not configured");
	return secret;
};

export const signJwt = (payload: JwtPayload) => {
	return jwt.sign(payload, getJwtSecret(), {
		expiresIn: "7d",
	});
};

export const verifyJwt = (token: string): JwtPayload => {
	return jwt.verify(token, getJwtSecret()) as JwtPayload;
};