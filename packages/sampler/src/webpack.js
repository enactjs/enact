const path = require('path');
const {DefinePlugin} = require('webpack');
const autoprefixer = require('autoprefixer');
const flexbugfixes = require('postcss-flexbugs-fixes');
const LessPluginRi = require('resolution-independence');
const GracefulFsPlugin = require('@enact/dev-utils/plugins/GracefulFsPlugin');
const ILibPlugin = require('@enact/dev-utils/plugins/ILibPlugin');
const WebOSMetaPlugin = require('@enact/dev-utils/plugins/WebOSMetaPlugin');
const app = require('@enact/dev-utils/option-parser');

function configure (dirname) {
	return {
		devtool: 'sourcemap',
		resolve: {
			alias: {
				'ilib':'@enact/i18n/ilib/lib',
				'webpack/hot/dev-server': require.resolve('webpack/hot/dev-server')
			},
			modules: [path.resolve('./node_modules'), 'web_modules', 'node_modules'],
			extensions: ['.js', '.jsx', '.es6']
		},
		resolveLoader: {
			modules: [path.resolve('./node_modules'), 'web_loaders', 'web_modules', 'node_loaders', 'node_modules']
		},
		module: {
			rules: [
				{
					test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
				},
				{
					test:/\.(c|le)ss$/,
					use: [
						'style-loader',
						{
							loader: require.resolve('css-loader'),
							options: {
								importLoaders: 2,
								modules: true,
								sourceMap: true,
								localIdentName: '[name]__[local]___[hash:base64:5]'
							}
						},
						{
							loader: require.resolve('postcss-loader'),
							options: {
								ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
								sourceMap: true,
								plugins: () => [
									// We use PostCSS for autoprefixing only, but others could be added.
									autoprefixer({
										browsers: app.browsers,
										flexbox: 'no-2009',
										remove: false
									}),
									// Fix and adjust for known flexbox issues
									// See https://github.com/philipwalton/flexbugs
									flexbugfixes
								]
							}
						},
						{
							loader: require.resolve('less-loader'),
							options: {
								sourceMap: true,
								// If resolution independence options are specified, use the LESS plugin.
								plugins: ((app.ri) ? [new LessPluginRi(app.ri)] : [])
							}
						}
					]
				},
				{
					test: /\.js$|\.es6$|\.jsx$/, loader: 'babel-loader', exclude: /node_modules.(?!@*enact)/, query: {
						extends: path.join(dirname, '.babelrc')
					}
				}
			]
		},
		devServer: {
			host: '0.0.0.0',
			port: 8080
		},
		plugins: [
			// Make NODE_ENV environment variable available to the JS code, for example:
			// if (process.env.NODE_ENV === 'development') { ... }.
			new DefinePlugin({
				'process.env': {
					'NODE_ENV': '"development"'
				}
			}),
			// Switch the internal NodeOutputFilesystem to use graceful-fs to avoid
			// EMFILE errors when hanndling mass amounts of files at once, such as
			// what happens when using ilib bundles/resources.
			new GracefulFsPlugin(),
			// Automatically configure iLib library within @enact/i18n. Additionally,
			// ensure the locale data files and the resource files are copied during
			// the build to the output directory.
			new ILibPlugin(),
			// Automatically detect ./appinfo.json and ./webos-meta/appinfo.json files,
			// and parses any to copy over any webOS meta assets at build time.
			new WebOSMetaPlugin({path:path.join(dirname, 'webos-meta')})
		]
	};
}

module.exports = configure;
