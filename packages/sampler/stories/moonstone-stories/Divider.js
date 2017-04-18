import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, text, withKnobs} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of divider',
		() => (
			<Divider
				disabled={nullify(boolean('disabled', false))}
			>
				{text('children', 'divider text')}
			</Divider>
		)
	);
