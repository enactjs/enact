import IconButton, {IconButtonBase} from '@enact/moonstone/IconButton';
import icons from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

// import icons
import fwd from '../../images/icon-fwd-btn.png';
import play from '../../images/icon-play-btn.png';
import rew from '../../images/icon-rew-btn.png';

const Config = mergeComponentMetadata('IconButton', IconButtonBase, IconButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

storiesOf('IconButton')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic IconButton',
		() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				color={nullify(select('color', [null, 'red', 'green', 'yellow', 'blue']))}
				disabled={nullify(boolean('disabled', false))}
				selected={nullify(boolean('selected', false))}
				small={boolean('small', false)}
			>
				{select('src', ['', fwd, play, rew], '') + select('icon', ['', ...icons], 'plus') + text('custom icon', '')}
			</IconButton>
		),
		{propTables: [Config]}
	);
