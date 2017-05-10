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
	backgroundOpacity: ['', 'translucent', 'transparent'],
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
				disabled={boolean('disabled', ButtonBase.defaultProps.disabled)}
				icon={nullify(select('icon', prop.icons))}
				minWidth={nullify(boolean('minWidth', ButtonBase.defaultProps.minWidth))}
				selected={nullify(boolean('selected', false))}
				small={nullify(boolean('small', ButtonBase.defaultProps.small))}
			>
				{text('children', 'Click Me')}
			</Button>
		),
		{propTables: [Config]}
	);
