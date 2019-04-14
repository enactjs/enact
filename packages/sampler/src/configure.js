import {configure, addDecorator} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {setDefaults} from '@storybook/addon-info';

import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {

	addDecorator(Moonstone);
	addDecorator(withKnobs({
		// debounce: {wait: 500}, // Same as lodash debounce.
		timestamps: true // Doesn't emit events while user is typing.
	}));

	// Set addon-info defaults
	setDefaults({
		propTables: null, // Disable all propTables
		// header: false, // Global configuration for the info addon across all of your stories.
		// inline: true,
		styles: {
			children: {
				// backgroundColor: 'purple',  // For easier debugging
				width: '100%',
				height: '100%'
			}
		}
	});

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
