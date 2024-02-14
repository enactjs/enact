import '@testing-library/jest-dom';
import {createEvent, fireEvent, render, screen} from '@testing-library/react';
import {createRef} from 'react';

import {getKeyFromSource, Media} from '../Media';

let mediaLoadStub;
let mediaPlayStub;
let mediaPauseStub;

const customMediaEventsMap = {
	custom : 'onCustom'
};

describe('Media', () => {
	beforeEach(() => {
		mediaLoadStub = jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => true);
		mediaPlayStub = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => true);
		mediaPauseStub = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => true);
	});

	afterEach(() => {
		mediaLoadStub.mockRestore();
		mediaPlayStub.mockRestore();
		mediaPauseStub.mockRestore();
	});

	test('should use the same node when changing the `source`', () => {
		const {rerender} = render(
			<Media mediaComponent="video" data-testid="media-id" source="abc.mp4" />
		);

		const expected = screen.getByTestId('media-id');

		rerender(
			<Media mediaComponent="video" data-testid="media-id" source="def.mp4" />
		);

		const actual = screen.getByTestId('media-id');

		expect(actual).toBe(expected);
	});

	test('should return the key when a node provided', () => {
		const expected = 'path/file.mp4';
		const actual = getKeyFromSource(<source src="path/file.mp4" type="video/mp4" />);

		expect(actual).toEqual(expected);
	});

	test('should fire `onCanPlay` when canplay event is fired', () => {
		const handleCanPlay = jest.fn();

		render(
			<Media mediaComponent="video" data-testid="media-id" onCanPlay={handleCanPlay} />
		);

		const video = screen.getByTestId('media-id');
		const canPlayEvent = createEvent('canplay', video);
		fireEvent(video, canPlayEvent);

		expect(handleCanPlay).toBeCalled();
	});

	test('should fire `onCustom` when custom event is fired', () => {
		const handleCustom = jest.fn();

		render(
			<Media mediaComponent="video" data-testid="media-id" onCustom={handleCustom} customMediaEventsMap={customMediaEventsMap} />
		);

		const video = screen.getByTestId('media-id');
		const customEvent = createEvent('custom', video);
		fireEvent(video, customEvent);

		expect(handleCustom).toBeCalled();
	});

	test('should call load', () => {
		const ref = createRef();

		render(
			<Media ref={ref} mediaComponent="video" />
		);

		ref.current.load();

		expect(mediaLoadStub).toHaveBeenCalled();
	});

	test('should call play', () => {
		const ref = createRef();

		render(
			<Media ref={ref} mediaComponent="video" />
		);

		ref.current.play();

		expect(mediaPlayStub).toHaveBeenCalled();
	});

	test('should call pause', () => {
		const ref = createRef();

		render(
			<Media ref={ref} mediaComponent="video" />
		);

		ref.current.pause();

		expect(mediaPauseStub).toHaveBeenCalled();
	});

	test('should return duration', () => {
		const ref = createRef();

		render(
			<Media ref={ref} mediaComponent="video" data-testid="media-id" />
		);

		const video = screen.getByTestId('media-id');
		const expected = 10;

		// fake duration
		Object.defineProperty(video, 'duration', {
			writable: true,
			value: expected
		});

		const actual = ref.current.duration;

		expect(actual).toEqual(expected);
	});

	test('should return proportionPlayed', () => {
		const ref = createRef();

		render(
			<Media ref={ref} mediaComponent="video" data-testid="media-id" />
		);

		const video = screen.getByTestId('media-id');

		// fake duration
		Object.defineProperty(video, 'duration', {
			writable: true,
			value: 10
		});

		ref.current.currentTime = 3;

		const expected = 0.3;
		const actual = ref.current.proportionPlayed;

		expect(actual).toEqual(expected);
	});

	test('should be able to get and set the current time', () => {
		const ref = createRef();
		const expected = 3;

		render(
			<Media ref={ref} mediaComponent="video" />
		);

		ref.current.currentTime = expected;
		const actual = ref.current.currentTime;

		expect(actual).toEqual(expected);
	});

	test('should be able to get and set the playback rate', () => {
		const ref = createRef();
		const expected = 2;

		render(
			<Media ref={ref} mediaComponent="video" />
		);

		ref.current.playbackRate = expected;
		const actual = ref.current.playbackRate;

		expect(actual).toEqual(expected);
	});
});
