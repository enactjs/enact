import RangePicker, {RangePickerBase} from '@enact/moonstone/RangePicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';
import nullify from '../../src/utils/nullify.js';

const Config = mergeComponentMetadata('RangePicker', RangePickerBase, RangePicker);

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large', 1, 2, 3, 4, 5, 6]
};
const parseIntOrNullify = (v) => {
	if (!isNaN(parseInt(v))) {
		return parseInt(v);
	} else {
		return nullify(v);
	}
};

RangePicker.displayName = 'RangePicker';

storiesOf('Moonstone', module)
	.add(
		'RangePicker',
		() => (
			<RangePicker
				onChange={action('onChange')}
				min={number('min', Config, 0)}
				max={number('max', Config, 100)}
				step={number('step', Config, 5)}
				defaultValue={0}
				width={parseIntOrNullify(select('width', prop.width, Config, 'small'))}
				orientation={select('orientation', prop.orientation, Config, 'horizontal')}
				wrap={boolean('wrap', Config)}
				joined={boolean('joined', Config)}
				noAnimation={boolean('noAnimation', Config)}
				disabled={boolean('disabled', Config)}
				incrementIcon={select('incrementIcon', ['', ...incrementIcons], Config)}
				decrementIcon={select('decrementIcon', ['', ...decrementIcons], Config)}
			/>
		),
		{
			info: {
				text: 'Basic usage of RangePicker'
			}
		}
	);
