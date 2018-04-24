import DayPicker, {DayPickerBase} from '@enact/moonstone/DayPicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('Moonstone', module)
	.add(
		'DayPicker',
		withInfo({
			propTables: [DayPickerBase],
			text: 'The basic DayPicker'
		})(() => (
			<DayPicker
				dayNameLength={text('dayNameLength', 'long')}
				title={text('title', 'Day Picker')}
				noneText={text('noneText', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		))
	);
