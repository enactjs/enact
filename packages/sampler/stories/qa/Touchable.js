import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import Button from '@enact/moonstone/Button';
import React from 'react';
import Touchable from '@enact/ui/Touchable';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number} from '../../src/enact-knobs';

const TouchableDiv = Touchable('div');

const onInteractionEnd = () => {
	const el = document.getElementById('touchRadius');
	el.style.display = 'none';
};
const onHoldEnd = (ev) => {
	onInteractionEnd(ev);
	return action('onHoldEnd')(ev);
};

const TouchArea = kind({
	name: 'TouchArea',

	propTypes: {
		moveTolerance: PropTypes.number
	},

	handlers: {
		onInteractionStart: (ev, {moveTolerance}) => {
			const el = document.getElementById('touchRadius');
			const x = ev.clientX || ev.touches && ev.touches[0].clientX;
			const y = ev.clientY || ev.touches && ev.touches[0].clientY;

			el.style.display = 'block';
			el.style.left = `${x - moveTolerance}px`;
			el.style.top = `${y - moveTolerance}px`;
			return false;
		}
	},

	render: ({children, moveTolerance, onInteractionStart, ...rest}) => (<React.Fragment>
		<TouchableDiv
			{...rest}
			onHoldEnd={onHoldEnd}
			onMouseDown={onInteractionStart}
			onMouseUp={onInteractionEnd}
			onTouchStart={onInteractionStart}
			onTouchEnd={onInteractionEnd}
		>
			{children}
		</TouchableDiv>
		<div
			id="touchRadius"
			style={{
				display: 'none',
				position: 'fixed',
				height: (moveTolerance * 2) + 'px',
				width: (moveTolerance * 2) + 'px',
				borderRadius: '999px',
				border: '1px solid orange',
				backgroundColor: 'rgba(255, 180, 0, 0.3)',
				pointerEvents: 'none',
				touchAction: 'none'
			}}
		/>
	</React.Fragment>)
});

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
		() => {
			const moveTolerance = number('holdConfig moveTolerance', Button, 16, {range: true, min: 8, max: 160, step: 8});
			const cancelOnMove = boolean('holdConfig cancelOnMove', Button, true) || false;
			return (
				<TouchArea
					holdConfig={{
						moveTolerance,
						cancelOnMove
					}}
					moveTolerance={moveTolerance}
					noResume={boolean('noResume', TouchArea, false)}
					onHold={action('onHold')}
					onHoldPulse={action('onHoldPulse', {depth: 0})}
					disabled={boolean('disabled', TouchArea)}
					style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', border: '2px dashed #888', width: ri.unit(ri.scale(240), 'rem'), height: ri.unit(ri.scale(240), 'rem')}}
				>
					Resumable
				</TouchArea>
			);
		}
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
				style={{border: '2px dashed #888', width: ri.unit(ri.scale(500), 'rem'), height: ri.unit(ri.scale(500), 'rem')}}
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
					global: boolean('dragConfig global', TouchableDiv, false) || false,
					moveTolerance: number('dragConfig moveTolerance', TouchableDiv, 16)
				}}
				noResume={boolean('noResume', TouchableDiv, false)}
				onDragStart={action('onDragStart')}
				onDrag={action('onDrag')}
				onDragEnd={action('onDragEnd')}
				disabled={boolean('disabled', TouchableDiv)}
				style={{border: '2px dashed #888', width: ri.unit(ri.scale(500), 'rem'), height: ri.unit(ri.scale(500), 'rem')}}
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
