import ToggleButton from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {action} from '@storybook/addon-actions';
import {text, boolean, select} from '@storybook/addon-knobs';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'},
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
};

storiesOf('ToggleButton', module)
	.add(
		'with long text',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
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
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				disabled={boolean('disabled')}
				small={boolean('small')}
				toggleOnLabel={select('toggleOnLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
				toggleOffLabel={select('toggleOffLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
			/>
		)
	);


