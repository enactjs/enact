import IconButton, {IconButtonBase} from '@enact/moonstone/IconButton';
import icons from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

// import icons
import list from '../../images/icon-list.png';
import album from '../../images/icon-album.png';
import trash from '../../images/trash.svg';
import magnify from '../../images/magnify.svg';

const Config = mergeComponentMetadata('IconButton', IconButtonBase, IconButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

storiesOf('IconButton')
	.addWithInfo(
		' ',
		'The basic IconButton',
		() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				color={nullify(select('color', [null, 'red', 'green', 'yellow', 'blue']))}
				disabled={boolean('disabled', false)}
				noAnimation={boolean('noAnimation', true)}
				selected={nullify(boolean('selected', false))}
				small={boolean('small', false)}
				tooltipText={nullify(text('tooltipText', ''))}
			>
				{select('src', ['', list, album, trash, magnify], '') + select('icon', ['', ...icons], 'plus') + text('custom icon', '')}
			</IconButton>
		),
		{propTables: [Config]}
	);
