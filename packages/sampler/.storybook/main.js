import vite from '@enact/storybook-utils/configs/vite.js';
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
		name: '@storybook/react-vite'
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
	viteFinal: async (config, {configType}) => {
		const viteConfig = await vite(config, configType, __dirname);

		const reactDir = dirname(moduleRequire.resolve('react/package.json'));
		const reactDomDir = dirname(moduleRequire.resolve('react-dom/package.json'));
		const reactIsDir = dirname(moduleRequire.resolve('react-is/package.json'));
		viteConfig.resolve = viteConfig.resolve || {};
		viteConfig.resolve.alias = {
			...(viteConfig.resolve.alias || {}),
			react: reactDir,
			'react-dom': reactDomDir,
			'react-is': reactIsDir
		};

		return viteConfig;
	},
	typescript: {
		reactDocgen: false
	}
};
