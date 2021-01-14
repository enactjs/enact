const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = {
	stories: ['./../stories/default/*.js'],
	webpackFinal: async (config, {configType}) => {
		return webpack(config, configType, __dirname);
	}
}
