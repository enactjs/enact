import ToggleButton from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {text, boolean, select} from '@storybook/addon-knobs';

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
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				casing={select('casing', prop.casing, 'upper')}
				disabled={boolean('disabled')}
				small={boolean('small')}
				toggleOnLabel={text('toggleOnLabel', 'Loooooooooooooooooog On')}
				toggleOffLabel={text('toggleOffLabel', 'Loooooooooooooooooog Off')}
			/>
		)
	)
	.add(
		'with tall characters',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				casing={select('casing', prop.casing, 'upper')}
				disabled={boolean('disabled')}
				small={boolean('small')}
				toggleOnLabel={select('toggleOnLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
				toggleOffLabel={select('toggleOffLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
			/>
		)
	);
