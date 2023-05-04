import { withIronSessionApiRoute } from "iron-session/next";
import getConfig, { setConfig } from "next/config";

import { TProjectSettingComplete, TPublicProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";

export async function triggerProjectsUpdate() {
	const serverConfig = await getUpdatedNextConfig();

	setConfig(serverConfig);

	const projectsList: Array<TPublicProjectSettingComplete> = serverConfig.serverRuntimeConfig.projectsList.map(
		(project: TProjectSettingComplete) => {
			const { password: _, ...owner } = project.owner;

			return {
				...project,
				owner,
			};
		}
	);

	return projectsList;
}

async function getUpdatedNextConfig(): Promise<any> {
	const startupScript = require("/startup.js").startup;

	const currentConfig = getConfig();
	currentConfig.serverRuntimeConfig.projectsList = await startupScript({ log: false });

	return currentConfig;
}

export default withIronSessionApiRoute(
	async function updateProjects(req, res) {
		if (req.method !== "PUT") {
			return res.status(405).send({ ok: false, error: "method not allowed" });
		}

		if (!req.session.user) {
			return res.status(401).send({ ok: false, error: "unauthorized" });
		}

		// Update the next config with the projects list
		const projectsList = triggerProjectsUpdate();

		// Response

		return res.status(200).send(projectsList);
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	}
);
