import {configure} from '@storybook/react';

function config (stories, mod) {

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
