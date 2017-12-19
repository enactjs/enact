import TimePicker, {TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('TimePicker', TimePicker.propTypes, TimePickerBase.propTypes, {
	propTypes: {
		onChange: PropTypes.func,
		onClose: PropTypes.func,
		onOpen: PropTypes.func,
		open: PropTypes.bool,
		value: PropTypes.instanceOf(Date)
	}}
);
removeProps(Config, 'onChangeHour defaultOpen onChangeMeridiem hour onChangeMinute minute meridiem meridiems order');

storiesOf('TimePicker')
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
