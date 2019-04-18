import ToggleButton from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';

ToggleButton.displayName = 'ToggleButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	casing: ['preserve', 'sentence', 'word', 'upper'],
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
};

storiesOf('ToggleButton', module)
	.add(
		'with long text',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, ToggleButton)}
				casing={select('casing', prop.casing, ToggleButton, 'upper')}
				disabled={boolean('disabled', ToggleButton)}
				toggleOnLabel={text('toggleOnLabel', ToggleButton, 'Loooooooooooooooooog On')}
				toggleOffLabel={text('toggleOffLabel', ToggleButton, 'Loooooooooooooooooog Off')}
			/>
		)
	)
	.add(
		'with tall characters',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, ToggleButton)}
				disabled={boolean('disabled', ToggleButton)}				size={select('size', ['small', 'medium'], Config, 'medium')}
				toggleOnLabel={select('toggleOnLabel', prop.tallText, ToggleButton, 'ิ้  ไั  ஒ  து')}
				toggleOffLabel={select('toggleOffLabel', prop.tallText, ToggleButton, 'ิ้  ไั  ஒ  து')}
			/>
		)
	);
