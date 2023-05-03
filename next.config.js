/** @type {import('next').NextConfig} */
const { startup } = require("./startup");

const nextConfig = {
	reactStrictMode: true,

	compiler: {
		styledComponents: true,
	},
};

module.exports = async () => {
	nextConfig.serverRuntimeConfig = {
		projectsList: await startup(),
	};

	return nextConfig;
};
