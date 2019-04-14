const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const {DefinePlugin} = require('webpack');
const {optionParser: app, GracefulFsPlugin, ILibPlugin, WebOSMetaPlugin} = require('@enact/dev-utils');

function configure ({config, mode}, dirname) {
	const isProduction = mode === 'PRODUCTION';

	const getStyleLoaders = (cssLoaderOptions = {}, preProcessor) => {
		const loaders = [
			process.env.INLINE_STYLES ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
			{
				loader: require.resolve('css-loader'),
				options: Object.assign(
					{importLoaders: preProcessor ? 2 : 1, sourceMap: true},
					cssLoaderOptions.modules && {getLocalIdent: getCSSModuleLocalIdent},
					cssLoaderOptions
				)
			},
			{
				loader: require.resolve('postcss-loader'),
				options: {
					ident: 'postcss',
					sourceMap: true,
					plugins: () =>
						[
							require('postcss-flexbugs-fixes'),
							require('postcss-global-import'),
							require('postcss-preset-env')({
								autoprefixer: {
									flexbox: 'no-2009',
									remove: false
								},
								stage: 3,
								features: {'custom-properties': false}
							}),
							app.ri && require('postcss-resolution-independence')(app.ri)
						].filter(Boolean)
				}
			}
		];
		if (preProcessor) loaders.push(preProcessor);
		return loaders;
	};

	const getLessStyleLoaders = cssLoaderOptions =>
		getStyleLoaders(cssLoaderOptions, {
			loader: require.resolve('less-loader'),
			options: {
				modifyVars: Object.assign({__DEV__: !isProduction}, app.accent),
				sourceMap: true
			}
		});


	// Modify stock Storybook config for Enact-tailored experience
	config.devtool = 'sourcemap';
	config.resolve.alias.ilib = '@enact/i18n/ilib/lib';
	config.resolve.modules = [path.resolve('../node_modules'), 'node_modules'];
	config.performance = {hints: false};

	// Narrow rules into oneOf and add our custom rules first
	config.module.rules = [{oneOf: config.module.rules}];
	config.module.rules[0].oneOf.unshift(
		{
			test: /\.(jpe?g|gif|ico|png|svg|woff|ttf|wav|mp3|mp4|m4a|aac)$/,
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]'
			}
		},
		{
			test: /\.(js|jsx|ts|tsx)$/,
			exclude: /node_modules.(?!@enact)/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: {
						extends: path.join(dirname, '.babelrc'),
						babelrc: false,
						cacheDirectory: !isProduction,
						cacheCompression: false,
						highlightCode: true,
						compact: isProduction
					}
				}
			]
		},
		{
			test: /\.module\.css$/,
			use: getStyleLoaders({modules: true})
		},
		{
			test: /\.css$/,
			// The `forceCSSModules` Enact build option can be set true to universally apply
			// modular CSS support.
			use: getStyleLoaders({modules: app.forceCSSModules}),
			// Don't consider CSS imports dead code even if the
			// containing package claims to have no side effects.
			// Remove this when webpack adds a warning or an error for this.
			// See https://github.com/webpack/webpack/issues/6571
			sideEffects: true
		},
		{
			test: /\.module\.less$/,
			use: getLessStyleLoaders({modules: true})
		},
		{
			test: /\.less$/,
			use: getLessStyleLoaders({modules: app.forceCSSModules}),
			sideEffects: true
		}
	);
	// File-loader catch-all for any remaining unhandled extensions
	config.module.rules[0].oneOf.push({
		loader: require.resolve('file-loader'),
		exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.ejs$/, /\.json$/],
		options: {
			name: '[path][name].[ext]'
		}
	});


	config.plugins.push(
		new DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
			'process.env.PUBLIC_URL': JSON.stringify('.')
		}),
		new GracefulFsPlugin(),
		new ILibPlugin(),
		//new WebOSMetaPlugin({path:path.join(dirname, 'webos-meta')})
	);
	if (!process.env.INLINE_STYLES) {
		config.plugins.push(new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: 'chunk.[name].css'
		}));
	}

	return config;
}

module.exports = configure;
