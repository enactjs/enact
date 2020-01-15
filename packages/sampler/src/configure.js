import {configure, addDecorator} from '@storybook/react';
import {configureActions} from '@storybook/addon-actions';
import {withKnobs} from '@storybook/addon-knobs';
import {Component} from 'react';

// Fix for @storybook/addon-info which always needs at least an empty object for defaultProps.
Component.defaultProps = {};

import Environment from '../src/Environment';

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

	// Set environment defaults
	addDecorator(Environment);

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

export default config;
