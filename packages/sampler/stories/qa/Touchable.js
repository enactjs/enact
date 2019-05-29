import Button from '@enact/moonstone/Button';
import React from 'react';
import Touchable from '@enact/ui/Touchable';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number} from '../../src/enact-knobs';

const TouchableDiv = Touchable('div');

storiesOf('Touchable', module)
	.add(
		'with default hold events',
		() => (
			<Button
				onHold={action('onHold')}
				onHoldEnd={action('onHoldEnd')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled', Button)}
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
				onHoldEnd={action('onHoldEnd')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled', Button)}
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
					moveTolerance: number('holdConfig.moveTolerance', Button, 16),
					cancelOnMove: boolean('holdConfig.cancelOnMove', Button, true)
				}}
				noResume={boolean('noResume', Button, false)}
				onHold={action('onHold')}
				onHoldEnd={action('onHoldEnd')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled', Button)}
			>
				Resumable
			</Button>
		)
	)
	.add(
		'that does not resume when re-entering component',
		() => (
			<Button
				noResume={boolean('noResume', Button, true)}
				onHold={action('onHold')}
				onHoldEnd={action('onHoldEnd')}
				onHoldPulse={action('onHoldPulse')}
				disabled={boolean('disabled', Button)}
			>
				Not Resumable
			</Button>
		)
	)
	.add(
		'with onFlick handler',
		() => (
			<TouchableDiv
				onFlick={action('onFlick')}
				disabled={boolean('disabled', TouchableDiv)}
				style={{border: '2px dashed #888', width: 500, height: 500}}
			>
				Flick within this component
			</TouchableDiv>
		)
	)
	.add(
		'with drag handlers',
		() => (
			<TouchableDiv
				dragConfig={{
					global: boolean('dragConfig.global', TouchableDiv, false),
					moveTolerance: number('dragConfig.moveTolerance', TouchableDiv, 16)
				}}
				noResume={boolean('noResume', TouchableDiv, false)}
				onDragStart={action('onDragStart')}
				onDrag={action('onDrag')}
				onDragEnd={action('onDragEnd')}
				disabled={boolean('disabled', TouchableDiv)}
				style={{border: '2px dashed #888', width: 500, height: 500}}
			>
				Drag within this component. Setting <code>noResume</code> to <code>false</code> should
				prevent drag from resuming when re-entering this component after leaving.
			</TouchableDiv>
		)
	)
	.add(
		'onTap when clicked',
		() => (
			<TouchableDiv
				disabled={boolean('disabled', TouchableDiv)}
				noResume={boolean('noResume', TouchableDiv, false)}
				onClick={action('onClick')}
				onDown={action('onDown')}
				onMouseDown={action('onMouseDown')}
				onMouseUp={action('onMouseUp')}
				onTap={action('onTap')}
				onTouchEnd={action('onTouchEnd')}
				onTouchStart={action('onTouchStart')}
				onUp={action('onUp')}
				style={{border: '2px dashed #888', textAlign: 'center'}}
			>
				Click here
			</TouchableDiv>
		)
	);
