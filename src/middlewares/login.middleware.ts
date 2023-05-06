import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TMiddleware } from "@/shared/functions/middleware-session";

export default {
	match: "/login",
	exec: async function (req: NextRequest): Promise<NextResponse> {
		const response = NextResponse.next();

		const user = req.session;

		if (user) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		return response;
	},
} as TMiddleware;
