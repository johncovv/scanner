import { NextApiRequest, NextApiResponse } from "next/types";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/session";
import { environment } from "@/config/env";
import jwt from "@/shared/functions/jwt";

type TMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export function MethodLimiter(method: TMethod) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
			if (req.method !== method) {
				return res.status(405).json({ ok: false, message: "Method not allowed", ptMessage: "Método não permitido" });
			}

			return originalMethod.apply(this, [req, res]);
		};

		return descriptor;
	};
}

export function FuncMethodLimiter(method: TMethod) {
	return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<NextApiResponse | void>) {
		return async function (req: NextApiRequest, res: NextApiResponse) {
			if (req.method !== method) {
				return res.status(405).json({ ok: false, message: "Method not allowed", ptMessage: "Método não permitido" });
			}

			return handler(req, res);
		};
	};
}

export function WithSession(options?: { dispatchError?: boolean }) {
	const { dispatchError } = options || {};

	return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<NextApiResponse | void>) {
		return async function (req: NextApiRequest, res: NextApiResponse) {
			const token = req.cookies["auth-token"];

			if (token) {
				const decoded = await jwt.decode<TPublicUser>(token, environment.jwt_token);

				if (dispatchError) {
					if (!decoded) {
						throw new ApiError(401, "Invalid token", "Token de autenticação inválido");
					}

					if (decoded.exp && decoded.exp < Date.now() / 1000) {
						throw new ApiError(401, "Token expired", "Token de autenticação expirado");
					}
				}

				req.session = decoded || undefined;
			} else if (dispatchError) {
				throw new ApiError(401, "No token was found", "Nenhum token foi encontrado");
			}

			return handler(req, res);
		};
	};
}
