import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {select, text, withKnobs} from '@kadira/storybook-addon-knobs';

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of divider',
		() => (
			<Divider casing={select('casing', ['preserve', 'sentence', 'word', 'upper'])}>
				{text('children', 'divider text')}
			</Divider>
		)
	);
