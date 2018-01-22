import Button, {ButtonBase} from '@enact/moonstone/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';
import nullify from '../../src/utils/nullify.js';

const Config = mergeComponentMetadata('Button', ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Button')
	.addWithInfo(
		' ',
		'The basic Button',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				color={nullify(select('color', ['', 'red', 'green', 'yellow', 'blue'], ''))}
				disabled={boolean('disabled', Config.defaultProps.disabled)}
				icon={nullify(select('icon', prop.icons, Config.defaultProps.icon))}
				noAnimation={nullify(boolean('noAnimation', false))}
				minWidth={nullify(boolean('minWidth', Config.defaultProps.minWidth))}
				selected={nullify(boolean('selected', false))}
				small={nullify(boolean('small', Config.defaultProps.small))}
			>
				{text('children', 'click me')}
			</Button>
		),
		{propTables: [Config]}
	);
