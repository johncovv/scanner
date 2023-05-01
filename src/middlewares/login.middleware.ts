import { getIronSession } from "iron-session/edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { environment } from "@/config/env";

export default {
	match: "/login",
	exec: async function (req: NextRequest): Promise<NextResponse> {
		const response = NextResponse.next();

		const session = await getIronSession(req, response, {
			cookieName: environment.passport.cookie_name,
			password: environment.passport.password,
			cookieOptions: {
				secure: process.env.NODE_ENV === "production",
			},
		});

		if (session.user != null) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		return response;
	},
};
