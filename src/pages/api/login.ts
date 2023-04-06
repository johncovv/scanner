import { withIronSessionApiRoute } from "iron-session/next";
import getConfig from "next/config";

import { TProjectSettingComplete } from "@/@types/project";
import { environment } from "@/config/env";

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		if (req.method !== "POST") {
			return res.status(405).send({ ok: false, error: "method not allowed" });
		}

		const { username, password } = await req.body;

		const { serverRuntimeConfig } = getConfig();
		const { projectsList } = serverRuntimeConfig as { projectsList: Array<TProjectSettingComplete> };

		const targetProject = projectsList.find((project) => project.owner.username === username);

		if (!targetProject) {
			return res.status(401).send({ ok: false, error: "username/password is incorrect" });
		}

		// check if the username and password are correct

		const usernameIsCorrect = username === targetProject.owner.username;
		const passwordIsCorrect = password === targetProject.owner.password;

		if (!passwordIsCorrect || !usernameIsCorrect) {
			return res.status(401).send({ ok: false, error: "username/password is incorrect" });
		}

		const { password: _, ...user } = targetProject.owner;

		// set the user in the session
		req.session.user = Object.assign(user, { projectId: targetProject.id });

		await req.session.save();
		return res.status(200).send({ ok: true });
	},
	{
		cookieName: environment.passport.cookie_name,
		password: environment.passport.password,
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24,
			expires: new Date(Date.now() + 60 * 60 * 24),
			sameSite: "lax",
		},
	}
);
