import { GetServerSidePropsContext } from "next";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/session";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

export function withPageSession(handle: (context: GetServerSidePropsContext & { session: TPublicUser }) => unknown) {
	const originalHandler = handle;

	const newHandler = async (...args: [GetServerSidePropsContext]) => {
		const [context] = args;

		const token = context.req.cookies["auth-token"];

		if (!token) throw new ApiError(401, "Unauthorized", "Não autorizado");

		const decoded = await jwt.decode<TPublicUser>(token, environment.jwt_token);

		if (!decoded) {
			throw new ApiError(401, "Invalid token", "Token de autenticação inválido");
		}

		if (decoded.exp && decoded.exp < Date.now() / 1000) {
			throw new ApiError(401, "Token expired", "Token de autenticação expirado");
		}

		const contextWithSession = Object.assign({}, context, { session: decoded });
		return originalHandler(contextWithSession);
	};

	return newHandler;
}
