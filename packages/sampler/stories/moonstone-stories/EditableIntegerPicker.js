import EditableIntegerPicker, {EditableIntegerPickerBase} from '@enact/moonstone/EditableIntegerPicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

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

		withInfo({
			propTablesExclude: [EditableIntegerPicker],
			text: 'Basic usage of EditableIntegerPicker'
		})(() => (
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
				step={number('step', 1)}
				unit={text('unit', '')}
				width={select('width', prop.width,  Config)}
				wrap={boolean('wrap', Config)}
			/>
		))
	);
