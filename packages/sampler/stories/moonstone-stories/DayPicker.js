import DayPicker, {DayPickerBase} from '@enact/moonstone/DayPicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('DayPicker', module)
	.add(
		' ',
		withInfo({
			propTables: [DayPickerBase],
			text: 'The basic DayPicker'
		})(() => (
			<DayPicker
				title={text('title', 'Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		))
	);
