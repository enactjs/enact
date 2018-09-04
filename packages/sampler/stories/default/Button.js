import Button, {ButtonBase} from '@enact/moonstone/Button';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

// Button's prop `minWidth` defaults to true and we only want to show `minWidth={false}` in the JSX. In order to hide `minWidth` when `true`, we use the normal storybook boolean knob and return `void 0` when `true`.
Button.displayName = 'Button';
const Config = mergeComponentMetadata('Button', UIButtonBase, UIButton, ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	casing: ['preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Moonstone', module)
	.add(
		'Button',
		withInfo({
			text: 'The basic Button'
		})(() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				casing={select('casing', prop.casing, Config, 'upper')}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				minWidth={!!boolean('minWidth', Config)}
				selected={boolean('selected', Config)}
				small={boolean('small', Config)}
			>
				{text('children', Config, 'click me')}
			</Button>
		))
	);
