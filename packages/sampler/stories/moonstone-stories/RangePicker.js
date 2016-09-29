import RangePicker, {RangePickerBase} from '@enact/moonstone/RangePicker';
import Pickable from '@enact/ui/Pickable';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

const StatefulRangePicker = Pickable(RangePicker);
StatefulRangePicker.propTypes = Object.assign({}, RangePickerBase.propTypes, RangePicker.propTypes);
StatefulRangePicker.defaultProps = Object.assign({}, RangePickerBase.defaultProps, RangePicker.defaultProps);
StatefulRangePicker.displayName = 'RangePicker';

// Don't want to show `value` and it throws a warning, too!
delete StatefulRangePicker.propTypes.value;

// Set up some defaults for info and knobs
const prop = {
	orientation: {'horizontal': 'horizontal', 'vertical': 'vertical'},
	width: {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
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
				width={select('width', prop.width, 'small')}
				orientation={select('orientation', prop.orientation)}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			/>
		)
	);
