import { NextApiRequest, NextApiResponse } from "next/types";

import { environment } from "@/config/env";

export default function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).send({ ok: false, error: "method not allowed" });
	}

	req.session = null;

	return res.status(200).send({ ok: true });
}
