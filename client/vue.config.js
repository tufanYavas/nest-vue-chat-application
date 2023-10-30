// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		allowedHosts: ['localhost', new URL(process.env.VUE_APP_FRONTEND_URL).hostname, '192.168.1.1'],
	},
});
