import { getIronSession } from "iron-session/edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { environment } from "@/config/env";

export default {
	match: "/dashboard",
	guard: true,
	exec: async function (req: NextRequest): Promise<NextResponse> {
		const response = NextResponse.next();

		const { user } = req.session;

		if (!user) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		if (user.isAdmin) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		return response;
	},
};
