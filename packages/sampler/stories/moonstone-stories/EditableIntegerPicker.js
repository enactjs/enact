import EditableIntegerPicker, {EditableIntegerPickerBase} from '@enact/moonstone/EditableIntegerPicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number, text, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('EditableIntegerPicker', EditableIntegerPickerBase, EditableIntegerPicker);

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large']
};

storiesOf('EditableIntegerPicker')
	.addWithInfo(
		' ',
		'Basic usage of EditableIntegerPicker',
		() => (
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
		),
		{propTables: [Config]}
	);
