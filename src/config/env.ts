const environment = {
	adminPassword: process.env.ADMIN_PASSWORD!,
	staticDir: process.env.STATIC_DIR!,

	is_production: process.env.NODE_ENV === "production",
	jwt_token: process.env.JWT_TOKEN!,
};

if (!environment.jwt_token || !environment.jwt_token.length) throw new Error("JWT_TOKEN is not set on the environment");
if (!environment.adminPassword) throw new Error("ADMIN_PASSWORD is not set on the environment");
if (!environment.staticDir) throw new Error("STATIC_DIR is not set on the environment");

export { environment };
