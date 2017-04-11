import DatePicker, {DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('DatePicker', DatePickerBase, DatePicker);
removeProps(Config, 'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order');

storiesOf('DatePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic DatePicker',
		() => (
			<DatePicker
				title={text('title', 'Date')}
				noLabels={nullify(boolean('noLabels', false))}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		),
		{propTables: [Config]}
	);
