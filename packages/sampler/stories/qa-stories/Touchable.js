import Button from '@enact/moonstone/Button';
import React from 'react';
import Touchable from '@enact/ui/Touchable';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';

const TouchableDiv = Touchable('div');

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
				Not Resumable
			</Button>
		)
	)
	.add(
		'with onFlick handler',
		() => (
			<TouchableDiv
				onFlick={action('onFlick')}
				disabled={boolean('disabled')}
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
					global: boolean('dragConfig.global', false),
					moveTolerance: number('dragConfig.moveTolerance', 16)
				}}
				noResume={boolean('noResume', false)}
				onDragStart={action('onDragStart')}
				onDrag={action('onDrag')}
				onDragEnd={action('onDragEnd')}
				disabled={boolean('disabled')}
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
				onClick={action('onClick')}
				onMouseDown={action('onMouseDown')}
				onMouseUp={action('onMouseUp')}
				onTap={action('onTap')}
				onTouchStart={action('onTouchStart')}
				onTouchEnd={action('onTouchEnd')}
				style={{border: '2px dashed #888', textAlign: 'center'}}
			>
				Click here
			</TouchableDiv>
		)
	);
