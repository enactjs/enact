import ToggleButton from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	casing: ['preserve', 'sentence', 'word', 'upper']
};

const Config = mergeComponentMetadata('ToggleButton', ToggleButton);
ToggleButton.displayName = 'ToggleButton';

storiesOf('Moonstone', module)
	.add(
		'ToggleButton',
		withInfo({
			text: 'The basic ToggleButton'
		})(() => (
			<ToggleButton
				aria-label="toggle button"
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				casing={select('casing', prop.casing, Config, 'upper')}
				disabled={boolean('disabled', Config)}
				onToggle={action('onToggle')}
				size={select('size', ['small', 'medium'], Config, 'medium')}
				toggleOffLabel={text('toggleOffLabel', Config, 'Off')}
				toggleOnLabel={text('toggleOnLabel', Config, 'On')}
			>
				Missing Toggle Label
			</ToggleButton>
		))
	);
