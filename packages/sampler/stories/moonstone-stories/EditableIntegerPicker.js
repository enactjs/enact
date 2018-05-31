import EditableIntegerPicker from '@enact/moonstone/EditableIntegerPicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, text, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

EditableIntegerPicker.displayName = 'EditableIntegerPicker';

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large']
};

storiesOf('Moonstone', module)
	.add(
		'EditableIntegerPicker',

		withInfo({
			propTablesExclude: [EditableIntegerPicker],
			text: 'Basic usage of EditableIntegerPicker'
		})(() => (
			<EditableIntegerPicker
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
				defaultValue={20}
				disabled={boolean('disabled', false)}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				max={number('max', 100)}
				min={number('min', 0)}
				noAnimation={nullify(boolean('noAnimation', false))}
				onBlur={action('onBlur')}
				onChange={action('onChange')}
				onKeyDown={action('onKeyDown')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				step={number('step', 1)}
				unit={nullify(text('unit', ''))}
				width={nullify(select('width', prop.width,  prop.width[2]))}
				wrap={nullify(boolean('wrap', false))}
			/>
		))
	);
