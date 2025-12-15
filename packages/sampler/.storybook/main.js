import webpack from '@enact/storybook-utils/configs/webpack.js';
import {readFileSync} from 'fs';
import {dirname} from 'path';
import {loadCsf} from 'storybook/internal/csf-tools';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
	core: {
		disableTelemetry: true
	},
	features: {
		backgrounds: false,
		interactions: false,
		postcss: false,
		viewport: false,
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
		'@storybook/addon-docs'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	},
	typescript: {
		reactDocgen: false
	}
};
