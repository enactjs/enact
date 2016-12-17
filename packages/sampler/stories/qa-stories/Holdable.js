import Button from '@enact/moonstone/Button';
import Holdable from '@enact/ui/Holdable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const HoldableButton = Holdable(Button);
const LongPressButton = Holdable({
	events: [
		{name: 'hold', time: 1000},
		{name: 'longpress', time: 2000}
	],
	frequency: 1000
}, Button);
const ResumeHoldButton = Holdable({resume: true, endHold: 'onLeave'}, Button);

HoldableButton.propTypes = Object.assign({}, Button.propTypes, HoldableButton.propTypes);
HoldableButton.defaultProps = Object.assign({}, Button.defaultProps, HoldableButton.defaultProps);
HoldableButton.displayName = 'HoldableButton';

LongPressButton.propTypes = Object.assign({}, Button.propTypes, LongPressButton.propTypes);
LongPressButton.defaultProps = Object.assign({}, Button.defaultProps, LongPressButton.defaultProps);
LongPressButton.displayName = 'LongPressButton';

ResumeHoldButton.propTypes = Object.assign({}, Button.propTypes, ResumeHoldButton.propTypes);
ResumeHoldButton.defaultProps = Object.assign({}, Button.defaultProps, ResumeHoldButton.defaultProps);
ResumeHoldButton.displayName = 'ResumeHoldButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

storiesOf('Holdable')
	.addDecorator(withKnobs)
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
	);

