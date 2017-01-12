import RangePicker, {RangePickerBase} from '@enact/moonstone/RangePicker';
import Changeable from '@enact/ui/Changeable';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

const StatefulRangePicker = Changeable(RangePicker);
StatefulRangePicker.propTypes = Object.assign({}, RangePickerBase.propTypes, RangePicker.propTypes);
StatefulRangePicker.defaultProps = Object.assign({}, RangePickerBase.defaultProps, RangePicker.defaultProps);
StatefulRangePicker.displayName = 'RangePicker';

// Don't want to show `value` and it throws a warning, too!
delete StatefulRangePicker.propTypes.value;

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: ['<null>', 'small', 'medium', 'large', 1, 2, 3, 4, 5, 6]
};
const nullify = (v) => {
	if (v === '<null>') {
		return null;
	}
	if (!isNaN(parseInt(v))) {
		return parseInt(v);
	}
	return v;
};

const iconNames = ['', ...Object.keys(icons)];

storiesOf('RangePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RangePicker',
		() => (
			<StatefulRangePicker
				onChange={action('onChange')}
				min={number('min', 0)}
				max={number('max', 100)}
				step={number('step', 5)}
				defaultValue={0}
				width={nullify(select('width', prop.width, 'small'))}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap', false)}
				joined={boolean('joined', false)}
				noAnimation={boolean('noAnimation', false)}
				disabled={boolean('disabled', false)}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			/>
		)
	);
