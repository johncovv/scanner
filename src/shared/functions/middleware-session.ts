import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/iron-session";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

export type TMiddleware = {
	match: string;
	exec: (req: NextRequest) => Promise<NextResponse>;
};

export type TAuthHandler = (req: NextRequest) => Promise<NextResponse>;

export function withMiddlewareSession(handler: TAuthHandler): TAuthHandler {
	const originalHandler = handler;

	const newHandler = async (...args: [NextRequest]) => {
		const [req] = args;

		const token = req.cookies.get("auth-token")?.value;

		if (token) {
			const decoded = (await jwt.verify(token, environment.JWT_TOKEN)) as TPublicUser;

			req.session = decoded;
		}

		return originalHandler(...args);
	};

	return newHandler;
}
