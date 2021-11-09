const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	features: {
		postcss: false
	},
	stories: ['./../stories/default/*.js'],
	addons: [
		'@enact/storybook-utils/addons/actions/register',
		'@enact/storybook-utils/addons/controls/register',
		'@enact/storybook-utils/addons/docs/register',
		'@enact/storybook-utils/addons/toolbars/register'
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
