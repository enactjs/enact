import SimpleIntegerPicker, {SimpleIntegerPickerBase} from '@enact/moonstone/SimpleIntegerPicker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number, select} from '@kadira/storybook-addon-knobs';

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
				<div>
				Audio offset :
					<SimpleIntegerPicker
						onChange={action('onChange')}
						onClick = {action('onClick')}
						onBlur = {action('onBlur')}
						min={number('min', -10)}
						max={number('max', 10)}
						step={number('step', 1)}
						defaultValue={0}
						units={'sec'}
						width={parseIntOrNullify(select('width', prop.width, 'medium'))}
						orientation={select('orientation', prop.orientation, 'horizontal')}
						wrap={nullify(boolean('wrap', false))}
						joined={nullify(boolean('joined', true))}
						noAnimation={nullify(boolean('noAnimation', false))}
						disabled={boolean('disabled', false)}
						incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
						decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
					/> (-10 to 10)
				</div>
				<div>
					 Brightness:
					<SimpleIntegerPicker
						onChange={action('onChange')}
						onClick = {action('onClick')}
						onBlur = {action('onBlur')}
						min={number('min', 0)}
						max={number('max', 100)}
						step={number('step', 1)}
						defaultValue={0}
						units={'lumens'}
						width={parseIntOrNullify(select('width', prop.width, 'medium'))}
						orientation={select('orientation', prop.orientation, 'horizontal')}
						wrap={nullify(boolean('wrap', false))}
						joined={nullify(boolean('joined', true))}
						noAnimation={nullify(boolean('noAnimation', false))}
						disabled={boolean('disabled', false)}
						incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
						decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
					/> (0 to 100)
				</div>
				<div>
					 Volume:
					<SimpleIntegerPicker
						onChange={action('onChange')}
						onClick = {action('onClick')}
						onBlur = {action('onBlur')}
						min={number('min', 0)}
						max={number('max', 100)}
						step={number('step', 1)}
						defaultValue={0}
						width={parseIntOrNullify(select('width', prop.width, 'medium'))}
						orientation={select('orientation', prop.orientation, 'horizontal')}
						wrap={nullify(boolean('wrap', false))}
						joined={nullify(boolean('joined', true))}
						noAnimation={nullify(boolean('noAnimation', false))}
						disabled={boolean('disabled', false)}
						incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
						decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
					/> (0 to 100)
				</div>
			</div>
		),
		{propTables: [SimpleIntegerPicker]}
	);
