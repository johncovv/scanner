const environment = {
	adminPassword: process.env.ADMIN_PASSWORD!,
	staticDir: process.env.STATIC_DIR!,

	JWT_TOKEN: process.env.JWT_TOKEN!,
};

if (!environment.adminPassword) throw new Error("ADMIN_PASSWORD is not set on the environment");
if (!environment.staticDir) throw new Error("STATIC_DIR is not set on the environment");
if (!environment.JWT_TOKEN) throw new Error("JWT_TOKEN is not set on the environment");

export { environment };
