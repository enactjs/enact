const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	features: {
		postcss: false
	},
	stories: ['./../stories/default/*.js'],
	addons: [
		'@enact/storybook-utils/addons/actions/register',
		'@enact/storybook-utils/addons/knobs/register',
		'@enact/storybook-utils/addons/docs/register'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
