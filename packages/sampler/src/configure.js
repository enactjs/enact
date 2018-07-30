import {configure, addDecorator} from '@storybook/react';
import {withKnobsOptions} from '@storybook/addon-knobs';
import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	addDecorator(Moonstone);
	addDecorator(withKnobsOptions({
		// debounce: {wait: 500}, // Same as lodash debounce.
		timestamps: true // Doesn't emit events while user is typing.
	}));

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
