import Changeable from '@enact/ui/Changeable';
import {DatePicker, DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Picker = Changeable(DatePicker);
Picker.displayName = 'Changeable(DatePicker)';

const Config = mergeComponentMetadata('DatePicker', DatePicker, DatePickerBase, Picker);
removeProps(Config, 'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order');

storiesOf('DatePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic DatePicker',
		() => (
			<Picker
				title={text('title', 'Date')}
				noLabels={boolean('noLabels', false)}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		),
		{propTables: [Config]}
	);
