import Button, {ButtonBase} from '@enact/moonstone/Button';
import {Button as UIButton, ButtonBase as UIButtonBase} from '@enact/ui/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';
import nullify from '../../src/utils/nullify.js';

const Config = mergeComponentMetadata('Button', ButtonBase, Button, UIButton, UIButtonBase);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['opaque', 'translucent', 'lightTranslucent', 'transparent'],
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
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				disabled={boolean('disabled', Config.defaultProps.disabled)}
				icon={nullify(select('icon', prop.icons, Config.defaultProps.icon))}
				minWidth={boolean('minWidth', Config.defaultProps.minWidth)}
				selected={nullify(boolean('selected', false))}
				small={nullify(boolean('small', Config.defaultProps.small))}
			>
				{text('children', 'click me')}
			</Button>
		))
	);
