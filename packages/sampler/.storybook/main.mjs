import webpack from '@enact/storybook-utils/configs/webpack.js';
import {readFileSync} from 'fs';
import {createRequire} from 'module';
import {dirname} from 'path';
import {loadCsf} from 'storybook/internal/csf-tools';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const moduleRequire = createRequire(import.meta.url);

export default {
	core: {
		disableTelemetry: true,
		allowedHosts: true
	},
	features: {
		backgrounds: false,
		interactions: false,
		postcss: false,
		viewport: true,
		warnOnLegacyHierarchySeparator: false
	},
	framework: {
		name: '@storybook/react-webpack5'
	},
	experimental_indexers: (indexers) => { // eslint-disable-line camelcase
		const createIndex = async (fileName, opts) => {
			const code = readFileSync(fileName, {encoding: 'utf-8'});
			return loadCsf(code, {...opts, fileName}).parse().indexInputs;
		};

		return [
			{
				test: /\.[tj]sx?$/,
				createIndex
			},
			...(indexers || [])
		];
	},
	stories: ['./../stories/default/*.js'],
	staticDirs: ['../public'],
	addons: [
		'@enact/storybook-utils/addons/actions',
		'@enact/storybook-utils/addons/controls',
		...(process.env.PERF_PANEL === 'true' ? ['@github-ui/storybook-addon-performance-panel'] : [])
	],
	webpackFinal: async (config, {configType}) => {
		const webpackFinalConfig = await webpack(config, configType, __dirname);

		// Force a single React copy. Other enact packages might have different patch versions of React,
		// which causes "Cannot read properties of null (reading 'useEffect')"
		const reactDir = dirname(moduleRequire.resolve('react/package.json'));
		const reactDomDir = dirname(moduleRequire.resolve('react-dom/package.json'));
		const reactIsDir = dirname(moduleRequire.resolve('react-is/package.json'));
		webpackFinalConfig.resolve = webpackFinalConfig.resolve || {};
		webpackFinalConfig.resolve.alias = {
			...(webpackFinalConfig.resolve.alias || {}),
			react: reactDir,
			'react-dom': reactDomDir,
			'react-is': reactIsDir
		};

		return webpackFinalConfig;
	},
	typescript: {
		reactDocgen: false
	}
};
