import TimePicker, {TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

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

storiesOf('Moonstone', module)
	.add(
		'TimePicker',
		withInfo({
			propTables: [Config],
			text: 'The basic TimePicker'
		})(() => (
			<TimePicker
				hourAriaLabel={nullify(text('hourAriaLabel', ''))}
				hourLabel={nullify(text('hourLabel', ''))}
				meridiemAriaLabel={nullify(text('meridiemAriaLabel', ''))}
				meridiemLabel={nullify(text('meridiemLabel', ''))}
				minuteAriaLabel={nullify(text('minuteAriaLabel', ''))}
				minuteLabel={nullify(text('minuteLabel', ''))}
				noLabels={nullify(boolean('noLabels', false))}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'Time')}
			/>
		))
	);
