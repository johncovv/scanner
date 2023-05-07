import { NextApiRequest, NextApiResponse } from "next/types";

type TMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export function MethodLimiter(method: TMethod) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
			if (req.method !== method) return res.status(405).json({ ok: false, error: "Method not allowed" });

			return originalMethod.apply(this, [req, res]);
		};

		return descriptor;
	};
}
