// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	transpileDependencies: true,
	// plugins: [
	//   new webpack.ProvidePlugin({
	//     $: 'jquery',
	//     jquery: 'jquery',
	//     'window.jQuery': 'jquery',
	//     jQuery: 'jquery',
	//   }),
	// ],
});
