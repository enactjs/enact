import TimePicker, {TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('TimePicker', TimePicker.propTypes, TimePickerBase.propTypes, {
	propTypes: {
		onChange: React.PropTypes.func,
		onClose: React.PropTypes.func,
		onOpen: React.PropTypes.func,
		open: React.PropTypes.bool,
		value: React.PropTypes.instanceOf(Date)
	}}
);
removeProps(Config, 'onChangeHour defaultOpen onChangeMeridiem hour onChangeMinute minute meridiem meridiems order');

storiesOf('TimePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic TimePicker',
		() => (
			<TimePicker
				title={text('title', 'Time')}
				noLabels={nullify(boolean('noLabels', false))}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		),
		{propTables: [Config]}
	);
