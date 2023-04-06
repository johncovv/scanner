const environment = {
	passport: {
		cookie_name: process.env.PASSPORT_COOKIE_NAME || "scanner-session",
		password: process.env.PASSPORT_PASSWORD!,
	},
};

if (!environment.passport.password) throw new Error("PASSPORT_PASSWORD is not set in .env file");

export { environment };
