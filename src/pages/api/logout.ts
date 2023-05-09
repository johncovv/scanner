import { NextApiRequest, NextApiResponse } from "next/types";
import cookie from "cookie";

import { MethodLimiter } from "@/shared/decorators/methods.decorator";
import { environment } from "@/config/env";

class Logout {
	constructor() {}

	@MethodLimiter("POST")
	static async handle(req: NextApiRequest, res: NextApiResponse) {
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
}

export default Logout.handle;
