import { NextApiRequest, NextApiResponse } from "next/types";
import cookie from "cookie";

import { environment } from "@/config/env";

export default function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).send({ ok: false, error: "method not allowed" });
	}

	// destroy cookie
	const destrutionCookie = cookie.serialize("auth-token", "", {
		httpOnly: true,
		maxAge: -1,
		path: "/",
		sameSite: "lax",
		secure: environment.is_production,
	});

	res.setHeader("Set-Cookie", destrutionCookie);

	req.session = null;

	return res.status(200).send({ ok: true });
}
