import { NextApiRequest, NextApiResponse } from "next/types";

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
