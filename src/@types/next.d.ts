import { NextApiRequest, GetServerSidePropsContext } from "next/types";
import { NextRequest } from "next/server";

import { TPublicUser } from "@/@types/iron-session";

declare module "next/types" {
	export interface NextApiRequest {
		session: TPublicUser | null;
	}

	export interface GetServerSidePropsContext {
		teste: string;
	}
}

declare module "next/server" {
	export interface NextRequest {
		session: TPublicUser | null;
	}
}
