import { NextApiRequest, NextApiResponse } from "next";
import cookie, { CookieSerializeOptions } from "cookie";
import getConfig from "next/config";

import { MethodLimiter } from "@/shared/decorators/methods.decorator";
import { TProjectSettingComplete } from "@/@types/project";
import { TPublicUser } from "@/@types/session";
import { ApiError } from "@/shared/utils/api-error";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

class Auth {
	private static getCachedProjects() {
		const { serverRuntimeConfig } = getConfig();
		const { projectsList } = serverRuntimeConfig as { projectsList: Array<TProjectSettingComplete> };

		return projectsList;
	}

	private static findAndValidateUser(credentials: { username: string; password: string }): TPublicUser {
		const { username, password } = credentials;

		// getting the cached projects list on server runtime

		const projectsList = Auth.getCachedProjects();

		const targetProject = projectsList.find((project) => project.owner.username === username);

		if (!targetProject) {
			throw new ApiError(401, "Invalid credentials", "Credenciais inválidas");
		}

		// validate username and password

		const usernameIsCorrect = username === targetProject.owner.username;
		const passwordIsCorrect = password === targetProject.owner.password;

		if (!passwordIsCorrect || !usernameIsCorrect) {
			throw new ApiError(401, "Invalid credentials", "Credenciais inválidas");
		}

		// if everything is correct, return the public user

		return Object.assign({}, targetProject.owner, { projectId: targetProject.id, password: undefined, isAdmin: false });
	}

	private static async generateToken(user: TPublicUser) {
		return await jwt.generate(user, environment.jwt_token, { expiresIn: "7d", subject: "authentication" });
	}

	private static async createAndSetCookie(res: NextApiResponse, { user }: { user: TPublicUser }) {
		const cookieOptions: CookieSerializeOptions = {
			secure: environment.is_production,
			maxAge: 60 * 60 * 24 * 7, // 7 days
			sameSite: "strict",
			httpOnly: true,
			path: "/",
		};

		const token = await Auth.generateToken(user);

		res.setHeader("Set-Cookie", cookie.serialize("auth-token", token, cookieOptions));
	}

	@MethodLimiter("POST")
	static async handler(req: NextApiRequest, res: NextApiResponse) {
		try {
			const { username, password } = req.body;

			if (!username || !password) {
				throw new ApiError(400, "Missing username or password", "Usuário ou senha faltando");
			}

			let user: TPublicUser;

			// check if user is admin, if so, handle as it should

			const isAdmin = username === "admin" && password === environment.adminPassword;

			if (isAdmin) {
				user = {
					name: "Administrador",
					username: "admin",
					isAdmin: true,
				};
			} else {
				user = Auth.findAndValidateUser({ username, password });
			}

			// generate token and set cookie

			await Auth.createAndSetCookie(res, { user });

			// return the user

			return res.status(200).json({ ok: true, user });
		} catch (error) {
			if (error instanceof ApiError) {
				return res.status(error.code).json({ ok: false, ...error });
			}

			console.error(error);

			return res
				.status(500)
				.json({ ok: false, message: "Internal server error", ptMessage: "Erro interno do servidor" });
		}
	}
}

export default Auth.handler;
