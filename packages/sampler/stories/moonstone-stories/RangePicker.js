import RangePicker, {RangePickerBase} from '@enact/moonstone/RangePicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

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

storiesOf('RangePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RangePicker',
		() => (
			<RangePicker
				onChange={action('onChange')}
				min={number('min', 0)}
				max={number('max', 100)}
				step={number('step', 5)}
				defaultValue={0}
				width={parseIntOrNullify(select('width', prop.width, 'small'))}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={nullify(boolean('wrap', false))}
				joined={nullify(boolean('joined', false))}
				noAnimation={nullify(boolean('noAnimation', false))}
				disabled={boolean('disabled', false)}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
			/>
		),
		{propTables: [Config]}
	);
