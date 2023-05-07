import { NextApiRequest, GetServerSidePropsContext } from "next/types";
import { NextRequest } from "next/server";

import { TPublicUser } from "@/@types/session";

declare module "next/types" {
	export interface NextApiRequest {
		session: TPublicUser | null;
	}
}

declare module "next/server" {
	export interface NextRequest {
		session: TPublicUser | null;
	}
}
