import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {VoiceControlDecorator} from '../VoiceControlDecorator';

const dispatchVoice = (node) => {
	node.dispatchEvent(new CustomEvent('webOSVoice', {
		bubbles: false,
		detail: {intent: 'Select'}
	}));
};

describe('VoiceControlDecorator', () => {
	test('should listen for webOSVoice on the wrapped node', () => {
		const onVoice = jest.fn();
		const VoiceDiv = VoiceControlDecorator('div');

		render(
			<VoiceDiv data-testid="voice" data-webos-voice-intent="Select" onVoice={onVoice} />
		);

		const voice = screen.getByTestId('voice');
		const marker = document.querySelector('[data-withref-referrer="VoiceControlDecorator"]');

		expect(marker).toHaveStyle({display: 'none'});
		expect(marker).toHaveAttribute('data-withref-target', voice.getAttribute('data-withref-id'));

		dispatchVoice(voice);

		expect(onVoice).toHaveBeenCalledTimes(1);
	});

	test('should hear webOSVoice dispatched on a nested voice target', () => {
		const onVoice = jest.fn();
		const Wrapped = (props) => (
			<div>
				<span {...props} />
			</div>
		);
		const VoiceWrapped = VoiceControlDecorator(Wrapped);

		render(
			<VoiceWrapped data-testid="target" data-webos-voice-intent="Select" onVoice={onVoice} />
		);

		dispatchVoice(screen.getByTestId('target'));

		expect(onVoice).toHaveBeenCalledTimes(1);
	});

	test('should ignore webOSVoice from a node that is not the voice target', () => {
		const onVoice = jest.fn();
		const Wrapped = (props) => (
			<div {...props}>
				<span data-testid="child" />
			</div>
		);
		const VoiceWrapped = VoiceControlDecorator(Wrapped);

		render(
			<VoiceWrapped data-testid="voice" data-webos-voice-intent="Select" onVoice={onVoice} />
		);

		dispatchVoice(screen.getByTestId('child'));

		expect(onVoice).not.toHaveBeenCalled();
	});

	test('should listen only to the first voice target', () => {
		const onVoice = jest.fn();
		const Wrapped = (props) => (
			<div>
				<span data-testid="first" {...props} />
				<span data-testid="second" data-webos-voice-intent="Select" />
			</div>
		);
		const VoiceWrapped = VoiceControlDecorator(Wrapped);

		render(
			<VoiceWrapped data-webos-voice-intent="Select" onVoice={onVoice} />
		);

		dispatchVoice(screen.getByTestId('second'));
		expect(onVoice).not.toHaveBeenCalled();

		dispatchVoice(screen.getByTestId('first'));
		expect(onVoice).toHaveBeenCalledTimes(1);
	});
});
