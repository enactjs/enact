import Button from '@enact/moonstone/Button';
import Touchable from '@enact/moonstone/internal/Touchable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean} from '@kadira/storybook-addon-knobs';

const LongPressButton = Touchable({
	events: [
		{name: 'hold', time: 1000},
		{name: 'longpress', time: 2000}
	],
	frequency: 1000
}, Button);

storiesOf('Touchable')
	.addWithInfo(
		'with default hold events',
		() => (
			<Button
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				Touchable
			</Button>
		)
	)
	.addWithInfo(
		'with a custom longpress event and 1 second frequency',
		() => (
			<LongPressButton
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				LongPress
			</LongPressButton>
		)
	)
	.addWithInfo(
		'that cancels the hold when moving beyond tolerance (16px)',
		() => (
			<Button
				cancelHoldOnMove={boolean('cancelHoldOnMove', true)}
				noResumeTouch={boolean('noResumeTouch', false)}
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				Resumable
			</Button>
		)
	)
	.addWithInfo(
		'that does not resume when re-entering component',
		() => (
			<Button
				cancelTouchOnLeave={boolean('cancelTouchOnLeave', false)}
				noResumeTouch={boolean('noResumeTouch', true)}
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				Resumable
			</Button>
		)
	);


