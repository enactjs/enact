import Button from '@enact/moonstone/Button';
import Holdable from '@enact/ui/Holdable';
import pick from 'ramda/src/pick';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

const HoldableButton = Holdable(Button);
const LongPressButton = Holdable({
	events: [
		{name: 'hold', time: 1000},
		{name: 'longpress', time: 2000}
	],
	frequency: 1000
}, Button);
const ResumeHoldButton = Holdable({resume: true, endHold: 'onLeave'}, Button);

const safeAction = (actionName) => {
	const actionHandler = action(actionName);

	return (ev) => {
		actionHandler(pick(['type', 'holdTime'], ev));
	};
};

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

storiesOf('Holdable')
	.addWithInfo(
		'with default hold events',
		() => (
			<HoldableButton
				onHold={safeAction('onHold')}
				onHoldPulse={safeAction('onHoldPulse')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
			>
				{text('value', 'Holdable')}
			</HoldableButton>
		)
	)
	.addWithInfo(
		'with a custom longpress event and 1 second frequency',
		() => (
			<LongPressButton
				onHold={safeAction('onHold')}
				onHoldPulse={safeAction('onHoldPulse')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
			>
				{text('value', 'LongPress')}
			</LongPressButton>
		)
	)
	.addWithInfo(
		'that can resume a hold on re-entry',
		() => (
			<ResumeHoldButton
				onHold={safeAction('onHold')}
				onHoldPulse={safeAction('onHoldPulse')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
			>
				{text('value', 'Resumable')}
			</ResumeHoldButton>
		)
	);

