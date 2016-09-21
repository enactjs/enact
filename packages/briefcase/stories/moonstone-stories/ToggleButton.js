import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

import Divider from 'enact-moonstone/Divider';
import Toggleable from 'enact-ui/Toggleable';
import ToggleButton from 'enact-moonstone/ToggleButton';

import css from '../common.less';

const buttonStories = storiesOf('ToggleButton').addDecorator(withKnobs);

const StatefulToggleButton = Toggleable(ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

buttonStories
	.addWithInfo(
		'basic',
		'The basic ToggleButton.',
		() => (
			<StatefulToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, 'opaque')}
				disabled={boolean('disabled')}
				preserveCase={boolean('preserveCase')}
				small={boolean('small')}
				toggleOnLabel={text('toggleOnLabel', 'On')}
				toggleOffLabel={text('toggleOffLabel', 'Off')}
			/>
		)
	)
;