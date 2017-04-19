import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, text, withKnobs} from '@kadira/storybook-addon-knobs';

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of divider',
		() => (
			<Divider preserveCase={boolean('preserveCase', false)}>
				{text('children', 'divider text')}
			</Divider>
		)
	);
