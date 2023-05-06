import { GetServerSidePropsContext } from "next";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/iron-session";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

export function withPageSession(handle: (context: GetServerSidePropsContext & { session: TPublicUser }) => unknown) {
	const originalHandler = handle;

	const newHandler = async (...args: [GetServerSidePropsContext]) => {
		const [context] = args;

		const token = context.req.cookies["auth-token"];

		if (!token) throw new ApiError(401, "Unauthorized", "Não autorizado");

		const decoded = (await jwt.verify(token, environment.JWT_TOKEN)) as TPublicUser;

		const contextWithSession = Object.assign({}, context, { session: decoded });
		return originalHandler(contextWithSession);
	};

	return newHandler;
}
