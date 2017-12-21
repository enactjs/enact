import Button, {ButtonBase} from '@enact/moonstone/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';
import nullify from '../../src/utils/nullify.js';

const Config = mergeComponentMetadata('Button', ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Button', module)
	.add(
		' ',
		withInfo({
			propTables: [Config],
			text: 'The basic Button'
		})(() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				disabled={boolean('disabled', ButtonBase.defaultProps.disabled)}
				icon={nullify(select('icon', prop.icons))}
				noAnimation={boolean('noAnimation', false)}
				minWidth={nullify(boolean('minWidth', ButtonBase.defaultProps.minWidth))}
				selected={nullify(boolean('selected', false))}
				small={nullify(boolean('small', ButtonBase.defaultProps.small))}
			>
				{text('children', 'click me')}
			</Button>
		))
	);
