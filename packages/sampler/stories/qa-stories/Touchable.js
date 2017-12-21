import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';

storiesOf('Touchable', module)
	.add(
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
	.add(
		'with a custom longpress event and 1 second frequency',
		() => (
			<Button
				holdConfig={{
					events: [
						{name: 'hold', time: 1000},
						{name: 'longpress', time: 2000}
					],
					frequency: 1000
				}}
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				LongPress
			</Button>
		)
	)
	.add(
		'that pauses the hold when moving beyond tolerance (16px)',
		() => (
			<Button
				holdConfig={{
					moveTolerance: number('holdConfig.moveTolerance', 16),
					cancelOnMove: boolean('holdConfig.cancelOnMove', true)
				}}
				noResume={boolean('noResume', false)}
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				Resumable
			</Button>
		)
	)
	.add(
		'that does not resume when re-entering component',
		() => (
			<Button
				noResume={boolean('noResume', true)}
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled')}
			>
				Resumable
			</Button>
		)
	);


