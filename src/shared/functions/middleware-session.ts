import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/session";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

export type TMiddleware = {
	match: string;
	isPrivate?: boolean;
	exec: (req: NextRequest) => Promise<NextResponse>;
};

export type TAuthHandler = (req: NextRequest) => Promise<NextResponse>;

export function withMiddlewareSession(handler: TAuthHandler, isPrivate: boolean = false): TAuthHandler {
	const originalHandler = handler;

	const newHandler = async (...args: [NextRequest]) => {
		const [req] = args;

		const token = req.cookies.get("auth-token")?.value;

		if (token) {
			const decoded = await jwt.decode<TPublicUser>(token, environment.jwt_token);

			if (isPrivate) {
				if (!decoded) {
					throw new ApiError(401, "Invalid token", "Token de autenticação inválido");
				}

				if (decoded.exp && decoded.exp < Date.now() / 1000) {
					throw new ApiError(401, "Token expired", "Token de autenticação expirado");
				}
			}

			req.session = decoded;
		}

		if (isPrivate && !req.session) {
			throw new ApiError(401, "Unauthorized", "Não autorizado");
		}

		return originalHandler(...args);
	};

	return newHandler;
}
