import Spinner from '@enact/moonstone/Spinner';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';

storiesOf('Spinner')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Spinner',
		() => (
			<Spinner
				transparent={boolean('transparent', false)}
				middle={boolean('middle', false)}
				center={boolean('center', false)}
			>
				{text('content', '')}
			</Spinner>
		)
	);
