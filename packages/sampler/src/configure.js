import {configure, addDecorator} from '@storybook/react';
import {loadStories} from '@enact/storybook-utils';
import {configureActions} from '@enact/storybook-utils/addons/actions';
import {withKnobs} from '@enact/storybook-utils/addons/knobs';
import {Component} from 'react';

// Fix for @storybook/addon-info which always needs at least an empty object for defaultProps.
Component.defaultProps = {};

import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	configureActions();
	addDecorator(withKnobs());

	// Set moonstone environment defaults
	addDecorator(Moonstone);

	configure(loadStories, mod);
}

export default config;
