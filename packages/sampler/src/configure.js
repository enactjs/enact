import {configure, addDecorator} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	addDecorator(Moonstone);
	addDecorator(withKnobs);

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
