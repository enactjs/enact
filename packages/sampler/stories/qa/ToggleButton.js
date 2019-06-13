import ToggleButton from '@enact/moonstone/ToggleButton';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import UiButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

ToggleButton.displayName = 'ToggleButton';
const Config = mergeComponentMetadata('ToggleButton', UIButtonBase, UiButton, ButtonBase, Button, ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	tallText:{'ฟิ้ ไั  ஒ  து': 'ฟิ้ ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
};

storiesOf('ToggleButton', module)
	.add(
		'with long text',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				size={select('size', ['small', 'large'], Config)}
				toggleOnLabel={text('toggleOnLabel', Config, 'Loooooooooooooooooog On')}
				toggleOffLabel={text('toggleOffLabel', Config, 'Loooooooooooooooooog Off')}
			/>
		)
	)
	.add(
		'with tall characters',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				size={select('size', ['small', 'large'], Config)}
				toggleOnLabel={select('toggleOnLabel', prop.tallText, Config, 'ฟิ้ ไั  ஒ  து')}
				toggleOffLabel={select('toggleOffLabel', prop.tallText, Config, 'ฟิ้ ไั  ஒ  து')}
			/>
		)
	);
