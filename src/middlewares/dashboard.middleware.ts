import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TMiddleware } from "@/shared/functions/middleware-session";

export default {
	match: "/dashboard",
	isPrivate: true,
	exec: async function (req: NextRequest): Promise<NextResponse> {
		const response = NextResponse.next();

		const user = req.session;

		if (!user) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		if (user.isAdmin) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		return response;
	},
} as TMiddleware;
