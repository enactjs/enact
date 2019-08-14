import TimePicker from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, text} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('TimePicker', TimePicker);
TimePicker.displayName = 'TimePicker';

storiesOf('Moonstone', module)
	.add(
		'TimePicker',
		() => (
			<TimePicker
				disabled={boolean('disabled', Config)}
				hourAriaLabel={text('hourAriaLabel', Config, '')}
				hourLabel={text('hourLabel', Config, '')}
				meridiemAriaLabel={text('meridiemAriaLabel', Config, '')}
				meridiemLabel={text('meridiemLabel', Config, '')}
				minuteAriaLabel={text('minuteAriaLabel', Config, '')}
				minuteLabel={text('minuteLabel', Config, '')}
				noLabels={boolean('noLabels', Config)}
				noneText={text('noneText', Config, 'Nothing Selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', Config, 'Time')}
			/>
		),
		{
			info: {
				text: 'The basic TimePicker'
			}
		}
	);
