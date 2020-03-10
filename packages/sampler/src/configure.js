import {configure, addDecorator} from '@storybook/react';
import {loadStories} from '@enact/storybook-utils';
import {configureActions} from '@enact/storybook-utils/addons/actions';
import {withKnobs} from '@enact/storybook-utils/addons/knobs';

import Environment from '../src/Environment';

function config (stories, mod) {
	configureActions();
	addDecorator(withKnobs());

	// Set environment defaults
	addDecorator(Environment);

	configure(loadStories(stories), mod);
}

export default config;
