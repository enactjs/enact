import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

import Button from 'enact-moonstone/Button';


const buttonStories = storiesOf('Button').addDecorator(withKnobs);



// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

buttonStories
	.addWithInfo(
		'basic',
		'The basic Button.',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, 'opaque')}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				pressed={boolean('pressed')}
				selected={boolean('selected')}
				small={boolean('small')}
				preserveCase={boolean('preserveCase')}
			>Button</Button>
		)
	)
;