const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	stories: ['./../stories/default/*@(js|md)'],
	addons: [
		'@enact/storybook-utils/addons/actions/register',
		'@enact/storybook-utils/addons/knobs/register',
		'@enact/storybook-utils/addons/docs/register',
	],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
