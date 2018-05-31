import DayPicker from '@enact/moonstone/DayPicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

DayPicker.displayName = 'DayPicker';

storiesOf('Moonstone', module)
	.add(
		'DayPicker',
		withInfo({
			propTablesExclude: [DayPicker],
			text: 'The basic DayPicker'
		})(() => (
			<DayPicker
				aria-label={nullify(text('aria-label', ''))}
				dayNameLength={select('dayNameLength', ['short', 'medium', 'long', 'full'], 'long')}
				disabled={boolean('disabled', false)}
				everyDayText={nullify(text('everyDayText', ''))}
				everyWeekdayText={nullify(text('everyWeekdayText', ''))}
				everyWeekendText={nullify(text('everyWeekendText', ''))}
				noneText={text('noneText', 'none')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				title={text('title', 'Day Picker')}
			/>
		))
	);
