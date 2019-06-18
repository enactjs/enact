import DatePicker, {DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata, removeProps} from '../../src/utils';

const Config = mergeComponentMetadata('DatePicker', DatePickerBase, DatePicker);
removeProps(Config, 'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order');

DatePicker.displayName = 'DatePicker';

storiesOf('Moonstone', module)
	.add(
		'DatePicker',
		() => (
			<DatePicker
				dayAriaLabel={text('dayAriaLabel', Config)}
				dayLabel={text('dayLabel', Config)}
				disabled={boolean('disabled', Config)}
				monthAriaLabel={text('monthAriaLabel', Config)}
				monthLabel={text('monthLabel', Config)}
				noLabels={boolean('noLabels', Config)}
				noneText={text('noneText', Config, 'Nothing Selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', Config, 'Date')}
				yearAriaLabel={text('yearAriaLabel', Config)}
				yearLabel={text('yearLabel', Config)}
			/>
		),
		{
			info: {
				text: 'The basic DatePicker'
			}
		}
	);
