import DatePicker, {DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('DatePicker', DatePickerBase, DatePicker);
removeProps(Config, 'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order');

storiesOf('Moonstone', module)
	.add(
		'DatePicker',
		withInfo({
			propTables: [Config],
			text: 'The basic DatePicker'
		})(() => (
			<DatePicker
				dayAriaLabel={nullify(text('dayAriaLabel', ''))}
				dayLabel={nullify(text('dayLabel', ''))}
				monthAriaLabel={nullify(text('monthAriaLabel', ''))}
				monthLabel={nullify(text('monthLabel', ''))}
				noLabels={nullify(boolean('noLabels', false))}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'Date')}
				yearAriaLabel={nullify(text('yearAriaLabel', ''))}
				yearLabel={nullify(text('yearLabel', ''))}
			/>
		))
	);
