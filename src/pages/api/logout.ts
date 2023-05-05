import { withIronSessionApiRoute } from "iron-session/next";

import { environment } from "@/config/env";

export default withIronSessionApiRoute(
	function logoutRoute(req, res) {
		if (req.method !== "POST") {
			return res.status(405).send({ ok: false, error: "method not allowed" });
		}

		req.session.user = null;

		return res.status(200).send({ ok: true });
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	}
);
