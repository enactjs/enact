import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of divider',
		() => (
			<Divider>
				{text('children', 'divider text')}
			</Divider>
		)
	);
