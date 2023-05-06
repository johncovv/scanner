import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TMiddleware, withMiddlewareSession } from "@/shared/functions/middleware-session";
import dashboardMiddleware from "@/middlewares/dashboard.middleware";
import adminMiddleware from "@/middlewares/admin.middleware";
import loginMiddleware from "@/middlewares/login.middleware";
import { ApiError } from "@/shared/utils/api-error";

export async function middleware(req: NextRequest): Promise<NextResponse> {
	let middlewares: Array<TMiddleware> = [dashboardMiddleware, adminMiddleware, loginMiddleware];

	// add the session to all middlewares
	middlewares = middlewares.map((m) => ({ ...m, exec: withMiddlewareSession(m.exec) }));

	// Find middleware to execute
	const middlewareToExec = middlewares.find((middleware) => middleware.match.match(req.nextUrl.pathname));

	if (middlewareToExec) {
		try {
			return await middlewareToExec.exec(req);
		} catch (error) {
			if (error instanceof ApiError && error.code === 401) {
				return NextResponse.redirect(new URL("/login", req.url));
			}

			throw error;
		}
	}

	return NextResponse.next();
}
