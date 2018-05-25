import Button, {ButtonBase} from '@enact/moonstone/Button';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, nullify, smartSelect} from '../../src/utils';

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
			propTables: [Config],
			text: 'The basic Button'
		})(() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={smartSelect('backgroundOpacity', prop.backgroundOpacity, Config)}
				casing={smartSelect('casing', prop.casing, Config, 'upper')}
				disabled={boolean('disabled', Config.defaultProps.disabled)}
				icon={smartSelect('icon', prop.icons, Config)}
				minWidth={boolean('minWidth', Config.defaultProps.minWidth)}
				selected={nullify(boolean('selected', false))}
				small={nullify(boolean('small', Config.defaultProps.small))}
			>
				{text('children', 'click me')}
			</Button>
		))
	);
