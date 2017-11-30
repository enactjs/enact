import SimpleIntegerPicker, {SimpleIntegerPickerBase} from '@enact/moonstone/SimpleIntegerPicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number, text, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('SimpleIntegerPicker', SimpleIntegerPickerBase, SimpleIntegerPicker);

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

storiesOf('SimpleIntegerPicker')
	.addWithInfo(
		' ',
		'Basic usage of SimpleIntegerPicker',
		() => (
			<div>
				Brightness :
				<SimpleIntegerPicker
					decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
					defaultValue={20}
					disabled={boolean('disabled', false)}
					incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
					joined={nullify(boolean('joined', true))}
					max={number('max', 100)}
					min={number('min', 0)}
					noAnimation={nullify(boolean('noAnimation', false))}
					onBlur={action('onBlur')}
					onChange={action('onChange')}
					onClick={action('onClick')}
					orientation={select('orientation', prop.orientation, 'horizontal')}
					step={number('step', 1)}
					unit={text('unit', 'lumens')}
					width={parseIntOrNullify(select('width', prop.width, 'medium'))}
					wrap={nullify(boolean('wrap', false))}
				/> (0 to 100)
			</div>
		),
		{propTables: [Config]}
	);
