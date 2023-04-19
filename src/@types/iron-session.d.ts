import { IronSession } from "iron-session";

export type TUser = {
	name: string;
	username: string;
	password: string;

	projectId?: string;
	isAdmin?: boolean;
};

export type TPublicUser = Omit<TUser, "password">;

declare module "iron-session" {
	interface IronSession {
		user?: TPublicUser;

		destroy: () => void;
		save: () => Promise<void>;
	}
}
