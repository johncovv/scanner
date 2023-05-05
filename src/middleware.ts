import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import dashboardMiddleware from "@/middlewares/dashboard.middleware";
import adminMiddleware from "@/middlewares/admin.middleware";
import loginMiddleware from "@/middlewares/login.middleware";
import { withAuth } from "@/shared/utils/with-auth";

type TMiddleware = {
	match: string;
	exec: (req: NextRequest) => Promise<NextResponse>;
	guard?: boolean;
};

function addAuthToMiddlewares(middlewares: Array<TMiddleware>) {
	// add auth to middlewares that need it
	return middlewares.map((middleware) => {
		if (middleware.guard) {
			return {
				...middleware,
				exec: withAuth(middleware.exec),
			};
		}

		return middleware;
	});
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
	let middlewares: Array<TMiddleware> = [dashboardMiddleware, adminMiddleware, loginMiddleware];

	middlewares = addAuthToMiddlewares(middlewares);

	const middlewareToExec = middlewares.find((middleware) => middleware.match.match(req.nextUrl.pathname));

	if (middlewareToExec) return middlewareToExec.exec(req);

	return NextResponse.next();
}
