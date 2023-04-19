const environment = {
	passport: {
		cookie_name: process.env.PASSPORT_COOKIE_NAME || "scanner-session",
		password: process.env.PASSPORT_PASSWORD!,
	},
	adminPassword: process.env.ADMIN_PASSWORD!,
};

if (!environment.passport.password) throw new Error("PASSPORT_PASSWORD is not set on the environment");
if (!environment.adminPassword) throw new Error("ADMIN_PASSWORD is not set on the environment");

export { environment };
