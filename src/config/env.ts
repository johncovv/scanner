const environment = {
	passport: {
		cookie_name: process.env.PASSPORT_COOKIE_NAME || 'scanner-session',
		password: process.env.PASSPORT_PASSWORD || 'temp-password',
	},
};

export { environment };
