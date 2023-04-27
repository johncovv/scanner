const environment = {
	passport: {
		cookie_name: process.env.PASSPORT_COOKIE_NAME || "scanner-session",
		password: process.env.PASSPORT_PASSWORD!,
	},
	adminPassword: process.env.ADMIN_PASSWORD!,
	staticDir: process.env.STATIC_DIR!,
};

const passportPassword = environment.passport.password;

if (!passportPassword) throw new Error("PASSPORT_PASSWORD is not set on the environment");
if (passportPassword.length < 32) throw new Error("PASSPORT_PASSWORD needs to be at least 32 characters long");
if (!environment.adminPassword) throw new Error("ADMIN_PASSWORD is not set on the environment");
if (!environment.staticDir) throw new Error("STATIC_DIR is not set on the environment");

export { environment };
