import {configure, addDecorator} from '@storybook/react';
import {configureActions} from '@storybook/addon-actions';
import {withKnobs} from '@storybook/addon-knobs';
import {Component} from 'react';

// Fix for @storybook/addon-info which always needs at least an empty object for defaultProps.
Component.defaultProps = {};

import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	configureActions({
		// Limit the number of items logged into the actions panel
		limit: 10
	});

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
