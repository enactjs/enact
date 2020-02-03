import {configure, addDecorator} from '@storybook/react';
import {loadStories} from '@enact/storybook-utils';
import {configureActions} from '@enact/storybook-utils/addons/actions';
import {withKnobs} from '@enact/storybook-utils/addons/knobs';

import Moonstone from '../src/MoonstoneEnvironment';

function config (stories, mod) {
	configureActions();
	addDecorator(withKnobs());

	// Set moonstone environment defaults
	addDecorator(Moonstone);

	configure(loadStories(stories), mod);
}

export default config;
