import { withIronSessionApiRoute } from "iron-session/next";
import getConfig, { setConfig } from "next/config";

import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		if (req.method !== "PUT") {
			return res.status(405).send({ ok: false, error: "method not allowed" });
		}

		if (!req.session.user) {
			return res.status(401).send({ ok: false, error: "unauthorized" });
		}

		// Update the next config with the projects list

		const projectsList = await getUpdatedNextConfig();

		setConfig(projectsList);

		// Response

		return res.status(200).send({ ok: true });
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24,
			expires: new Date(Date.now() + 60 * 60 * 24),
			sameSite: "lax",
		},
	}
);

async function getUpdatedNextConfig(): Promise<any> {
	const startupScript = require("/startup.js").startup;

	const currentConfig = getConfig();
	currentConfig.serverRuntimeConfig.projectsList = await startupScript({ log: false });

	return currentConfig;
}
