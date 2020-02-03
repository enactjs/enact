import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select, text} from '@enact/storybook-utils/addons/knobs';
import EditableIntegerPicker, {EditableIntegerPickerBase} from '@enact/moonstone/EditableIntegerPicker';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {decrementIcons, incrementIcons} from './icons';

const Config = mergeComponentMetadata('EditableIntegerPicker', EditableIntegerPickerBase, EditableIntegerPicker);
EditableIntegerPicker.displayName = 'EditableIntegerPicker';

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large']
};

storiesOf('Moonstone', module)
	.add(
		'EditableIntegerPicker',
		() => (
			<EditableIntegerPicker
				decrementIcon={select('decrementIcon', ['', ...decrementIcons], Config)}
				defaultValue={20}
				disabled={boolean('disabled', Config)}
				incrementIcon={select('incrementIcon', ['', ...incrementIcons], Config)}
				max={number('max', Config, 100)}
				min={number('min', Config, 0)}
				noAnimation={boolean('noAnimation', Config)}
				onBlur={action('onBlur')}
				onChange={action('onChange')}
				onKeyDown={action('onKeyDown')}
				orientation={select('orientation', prop.orientation, Config)}
				step={number('step', Config)}
				unit={text('unit', Config)}
				width={select('width', prop.width,  Config)}
				wrap={boolean('wrap', Config)}
			/>
		),
		{
			info: {
				text: 'Basic usage of EditableIntegerPicker'
			}
		}
	);
