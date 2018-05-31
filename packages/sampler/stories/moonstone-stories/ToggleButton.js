import ToggleButton from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {text, boolean, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	casing: ['preserve', 'sentence', 'word', 'upper']
};

ToggleButton.displayName = 'ToggleButton';

storiesOf('Moonstone', module)
	.add(
		'ToggleButton',
		withInfo({
			propTablesExclude: [ToggleButton],
			text: 'The basic ToggleButton'
		})(() => (
			<ToggleButton
				aria-label="toggle button"
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				casing={select('casing', prop.casing, 'upper')}
				disabled={boolean('disabled', false)}
				onToggle={action('onToggle')}
				small={nullify(boolean('small', false))}
				toggleOffLabel={text('toggleOffLabel', 'Off')}
				toggleOnLabel={text('toggleOnLabel', 'On')}
			>
				Missing Toggle Label
			</ToggleButton>
		))
	);
