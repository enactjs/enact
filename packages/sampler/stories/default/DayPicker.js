import DayPicker from '@enact/moonstone/DayPicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';

DayPicker.displayName = 'DayPicker';

storiesOf('Moonstone', module)
	.add(
		'DayPicker',
		() => (
			<DayPicker
				aria-label={text('aria-label', DayPicker)}
				dayNameLength={select('dayNameLength', ['short', 'medium', 'long', 'full'], DayPicker, 'long')}
				disabled={boolean('disabled', DayPicker)}
				everyDayText={text('everyDayText', DayPicker)}
				everyWeekdayText={text('everyWeekdayText', DayPicker)}
				everyWeekendText={text('everyWeekendText', DayPicker)}
				noneText={text('noneText', DayPicker, 'none')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				title={text('title', DayPicker, 'Day Picker')}
			/>
		),
		{
			info: {
				text: 'The basic DayPicker'
			}
		}
	);
