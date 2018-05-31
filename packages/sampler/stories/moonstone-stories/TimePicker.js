import TimePicker from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

TimePicker.displayName = 'TimePicker';

storiesOf('Moonstone', module)
	.add(
		'TimePicker',
		withInfo({
			propTablesExclude: [TimePicker],
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
