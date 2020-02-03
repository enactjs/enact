import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';

import iconNames from './icons';

// Button's prop `minWidth` defaults to true and we only want to show `minWidth={false}` in the JSX. In order to hide `minWidth` when `true`, we use the normal storybook boolean knob and return `void 0` when `true`.
Button.displayName = 'Button';
const Config = mergeComponentMetadata('Button', UIButtonBase, UIButton, ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	icons: ['', ...iconNames]
};

storiesOf('Moonstone', module)
	.add(
		'Button',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				color={select('color', ['', 'red', 'green', 'yellow', 'blue'], Config, '')}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				iconPosition={select('iconPosition', ['', 'before', 'after'], Config, '')}
				minWidth={boolean('minWidth', Config) ? void 0 : false}
				selected={boolean('selected', Config)}
				size={select('size', ['', 'small', 'large'], Config)}
			>
				{text('children', Config, 'click me')}
			</Button>
		),
		{
			info: {
				text: 'The basic Button'
			}
		}
	);
