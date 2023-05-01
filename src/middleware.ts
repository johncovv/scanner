import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import dashboardMiddleware from "@/middlewares/dashboard.middleware";
import adminMiddleware from "@/middlewares/admin.middleware";
import loginMiddleware from "@/middlewares/login.middleware";

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
	const middlewares = [dashboardMiddleware, adminMiddleware, loginMiddleware];

	const middlewareToExec = middlewares.find((middleware) => middleware.match.match(req.nextUrl.pathname));

	if (middlewareToExec) return middlewareToExec.exec(req);

	return NextResponse.next();
};
