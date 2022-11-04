const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	core: {
		builder: 'webpack5',
		disableTelemetry: true
	},
	features: {
		postcss: false,
		storyStoreV7: true,
		warnOnLegacyHierarchySeparator: false
	},
	framework: '@storybook/react',
	stories: ['./../stories/default/*.js'],
	addons: [
		'@enact/storybook-utils/addons/actions',
		'@enact/storybook-utils/addons/controls',
		'@enact/storybook-utils/addons/docs',
		'@enact/storybook-utils/addons/toolbars'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	},
	typescript: {
		reactDocgen: false
	}
}
