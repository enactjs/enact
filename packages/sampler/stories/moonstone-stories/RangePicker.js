import RangePicker from '@enact/moonstone/RangePicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

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
		withInfo({
			propTablesExclude: [RangePicker],
			text: 'Basic usage of RangePicker'
		})(() => (
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
		))
	);
