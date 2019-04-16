import {configure, addDecorator} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	// Set addon-info defaults
	addDecorator(withInfo({
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
	}));

	// Set addon-knobs defaults
	addDecorator(withKnobs({
		// debounce: {wait: 500}, // Same as lodash debounce.
		timestamps: true // Doesn't emit events while user is typing.
	}));

	// Set moonstone environment defaults
	addDecorator(Moonstone);

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
