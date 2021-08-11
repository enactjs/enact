const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	stories: ['./../stories/default/*.js'],
	addons: [
		'@enact/storybook-utils/addons/actions/register',
		'@enact/storybook-utils/addons/docs/register',
		'@storybook/addon-controls',
		'@storybook/addon-toolbars'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
