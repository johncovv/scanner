export type TUser = {
	name: string;
	username: string;
	password: string;

	projectId?: string;
	isAdmin?: boolean;
};

export type TPublicUser = Omit<TUser, "password">;
