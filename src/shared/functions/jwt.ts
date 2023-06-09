import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { v4 as uuid } from "uuid";

type TGenerateConfig = { expiresIn?: string | number; subject?: string };

const textEncoder = new TextEncoder();

async function decode<T = Record<string, unknown>>(token: string, secret: string): Promise<JWTPayload & T> {
	try {
		const verifiedToken = await jwtVerify(token, textEncoder.encode(secret));

		return verifiedToken.payload as JWTPayload & T;
	} catch {
		throw new Error("Invalid token");
	}
}

async function generate(payload: JWTPayload, secret: string, config: TGenerateConfig = {}) {
	const { expiresIn = "7d" } = config;

	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS512" })
		.setSubject(config.subject || "jwt-token")
		.setJti(uuid())
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(textEncoder.encode(secret));

	return jwt;
}

export default {
	decode,
	generate,
};
