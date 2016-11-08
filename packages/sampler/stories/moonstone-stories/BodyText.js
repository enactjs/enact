import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

storiesOf('BodyText')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic BodyText',
		() => (
			<BodyText
				centered={boolean('centered', false)}
			>
				{text('children', 'This is Body Text')}
			</BodyText>
		)
	);
