import { NextApiRequest } from "next/types";
import { NextRequest } from "next/server";

import { TPublicUser } from "@/@types/iron-session";

declare module "next/types" {
	export interface NextApiRequest {
		session: {
			user: TPublicUser | null;
		};
	}
}

declare module "next/server" {
	export interface NextRequest {
		session: {
			user: TPublicUser | null;
		};
	}
}
