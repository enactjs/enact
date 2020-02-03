import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';
import ToggleButton from '@enact/moonstone/ToggleButton';
import UiButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent']
};

ToggleButton.displayName = 'ToggleButton';
const Config = mergeComponentMetadata('ToggleButton', UIButtonBase, UiButton, ButtonBase, Button, ToggleButton);

storiesOf('Moonstone', module)
	.add(
		'ToggleButton',
		() => (
			<ToggleButton
				aria-label="toggle button"
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				onToggle={action('onToggle')}
				size={select('size', ['small', 'large'], Config)}
				toggleOffLabel={text('toggleOffLabel', Config, 'Off')}
				toggleOnLabel={text('toggleOnLabel', Config, 'On')}
			>
				Missing Toggle Label
			</ToggleButton>
		),
		{
			info: {
				text: 'The basic ToggleButton'
			}
		}
	);
