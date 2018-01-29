import ToggleButton, {ToggleButtonBase} from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {text, boolean, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ToggleButton', ToggleButtonBase, ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'transparent']
};

storiesOf('Moonstone', module)
	.add(
		'ToggleButton',
		withInfo({
			propTables: [Config],
			text: 'The basic ToggleButton'
		})(() => (
			<ToggleButton
				aria-label="toggle button"
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				onClick={action('onClick')}
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				disabled={boolean('disabled', false)}
				small={nullify(boolean('small', false))}
				toggleOnLabel={text('toggleOnLabel', 'On')}
				toggleOffLabel={text('toggleOffLabel', 'Off')}
			>
				Missing Toggle Label
			</ToggleButton>
		))
	);
