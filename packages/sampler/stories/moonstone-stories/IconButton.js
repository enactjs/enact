import IconButton, {IconButtonBase} from '@enact/moonstone/IconButton';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

const Config = mergeComponentMetadata('IconButton', IconButtonBase, IconButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent']
};

storiesOf('Moonstone', module)
	.add(
		'IconButton',
		withInfo({
			propTables: [Config],
			text: 'The basic IconButton'
		})(() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				color={nullify(select('color', [null, 'red', 'green', 'yellow', 'blue']))}
				disabled={boolean('disabled', false)}
				selected={nullify(boolean('selected', false))}
				small={boolean('small', false)}
			>
				{select('src', ['', docs, factory, logo], '') + select('icon', ['', ...icons], 'plus') + text('custom icon', '')}
			</IconButton>
		))
	);
