import IconButton from '@enact/moonstone/IconButton';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import emptify from '../../src/utils/emptify.js';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent']
};

IconButton.displayName = 'IconButton';

storiesOf('Moonstone', module)
	.add(
		'IconButton',
		withInfo({
			text: 'The basic IconButton'
		})(() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, IconButton, '')}
				color={select('color', ['', 'red', 'green', 'yellow', 'blue'], IconButton, '')}
				disabled={boolean('disabled', IconButton)}
				selected={boolean('selected', IconButton)}
				small={boolean('small', IconButton)}
				tooltipText={text('tooltipText', IconButton, '')}
			>
				{emptify(select('src', ['', docs, factory, logo], '')) + emptify(select('icon', ['', ...icons], 'plus')) + emptify(text('custom icon', ''))}
			</IconButton>
		))
	);
