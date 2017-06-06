import Button from '@enact/moonstone/Button';
import Holdable from '@enact/ui/Holdable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

const HoldableButton = Holdable(Button);
const LongPressButton = Holdable({
	events: [
		{name: 'hold', time: 1000},
		{name: 'longpress', time: 2000}
	],
	frequency: 1000
}, Button);
const ResumeHoldButton = Holdable({resume: true, endHold: 'onLeave'}, Button);
const MultiKeyHoldButton = Holdable({resume: true, endHold: 'onLeave', keys: ['enter', 'left', 'right']}, Button);
const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

storiesOf('Holdable')
	.addWithInfo(
		'with default hold events',
		() => (
			<HoldableButton
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
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
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
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
				onHold={action('onHold')}
				onHoldPulse={action('onHoldPulse')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
			>
				{text('value', 'Resumable')}
			</ResumeHoldButton>
		)
	).addWithInfo(
		'that can use multiple keys to fire mulitple events',
		() => (
			<Container spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}>
				<MultiKeyHoldButton
					onHold={action('onHold')}
					onHoldPulse={action('onHoldPulse')}
					onHoldLeft={action('onHoldLeft')}
					onHoldPulseLeft={action('onHoldPulseLeft')}
					onHoldRight={action('onHoldRight')}
					onHoldPulseRight={action('onHoldPulseRight')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
					disabled={boolean('disabled')}
				>
					{text('value', 'Multiple Key')}
				</MultiKeyHoldButton>
			</Container>
		)
	);

