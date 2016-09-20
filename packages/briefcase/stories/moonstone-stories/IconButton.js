import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

import IconButton from 'enact-moonstone/IconButton';
const buttonStories = storiesOf('IconButton').addDecorator(withKnobs);


// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'},
	icon: {'gear': 'gear', 'list': 'list', 'pause': 'pause', 'play': 'play', 'search': 'search'}
};

buttonStories
	.addWithInfo(
		'basic',
		'The basic IconButton.',
		() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, 'opaque')}
				disabled={boolean('disabled')}
				small={boolean('small')}
			>{select('icon', prop.icon, 'play')}</IconButton>
		)
	)
;