import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { ApiError } from "@/shared/utils/api-error";
import { TPublicUser } from "@/@types/iron-session";
import { environment } from "@/config/env";


// ! this function cannot be used in middleware.ts
// ! error: The edge runtime does not support Node.js 'util' module

export const withAuth = function (handler: (req: NextRequest) => Promise<NextResponse>) {
	return new Proxy(handler, {
		apply(target, thisArg, argumentsList: [NextRequest]) {
			const [request] = argumentsList;

			const token = request.cookies.get("token")?.value;

			if (!token) throw new ApiError(401, "Unauthorized", "Não autorizado");

			const decoded = jwt.verify(token, environment.JWT_TOKEN) as TPublicUser;

			request.session.user = decoded;

			return target.apply(thisArg, argumentsList);
		},
	});
};
