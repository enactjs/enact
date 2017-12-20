import {configure, addDecorator} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';

function config (stories, mod) {
	addDecorator(withKnobs);

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
