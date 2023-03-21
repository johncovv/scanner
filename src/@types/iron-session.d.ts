import { IronSession } from 'iron-session';

export type TUser = {
	name: string;
	email: string;
	password: string;

	projectId: string;
};

export type TPublicUser = Omit<TUser, 'password'>;

declare module 'iron-session' {
	interface IronSession {
		user?: TUser;

		destroy: () => void;
		save: () => Promise<void>;
	}
}
