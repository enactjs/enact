const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	stories: ['./../stories/default/*.js'],
	addons: [
		'@enact/storybook-utils/addons/knobs/register',
		'@enact/storybook-utils/addons/actions/register'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
