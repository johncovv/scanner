import { JWTPayload, jwtVerify, SignJWT } from "jose";

const textEncoder = new TextEncoder();

async function verify(token: string, secret: string) {
	try {
		const verifiedToken = await jwtVerify(token, textEncoder.encode(secret));

		return verifiedToken.payload;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

async function generate(payload: JWTPayload, secret: string, config: { expiresIn?: string | number } = {}) {
	const { expiresIn = "7d" } = config;

	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS512" })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(textEncoder.encode(secret));

	return jwt;
}

export default {
	verify,
	generate,
};
