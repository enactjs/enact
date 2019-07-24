import React from 'react';
import {mount} from 'enzyme';
import {Audio, MediaPlayer} from '../MediaPlayer';

describe('MediaPlayer', () => {
	const filePath = 'path/file.media';

	test('should have the media element when the `src` and `type="audio"` props are set', () => {
		const mediaPlayer = mount(
			<MediaPlayer src={filePath} type="audio/mp3" />
		);

		const expected = 1;
		const actual = mediaPlayer.find('audio').length;

		expect(actual).toBe(expected);
	});

	test('should pass down mediaComponent to MediaBase when a `src` and `mediaComponent={Audio}` props are set', () => {
		const mediaPlayer = mount(
			<MediaPlayer src={filePath} mediaComponent={Audio} />
		);

		const expected = 1;
		const actual = mediaPlayer.find('audio').length;

		expect(actual).toBe(expected);
	});

	test('should favor `<source>` `src` prop over `MediaPlayer`', () => {
		const mediaPlayer = mount(
			<MediaPlayer src={`outer/${filePath}`}>
				<Audio>
					<source src={filePath} type="audio/mp3" />
				</Audio>
			</MediaPlayer>
		);

		const expected = filePath;
		const actual = mediaPlayer.find('source').prop('src');

		expect(actual).toBe(expected);
	});

	test('should have children in Overlay', () => {
		const mediaPlayer = mount(
			<MediaPlayer>
				<h1>Title</h1>
				<button>Button</button>
			</MediaPlayer>
		);

		const expected = 2;
		const actual = mediaPlayer.find('.overlay').children().length;

		expect(actual).toBe(expected);
	});

	test('should return the media component when `getMediaNode` is called', () => {
		const mediaPlayer = mount(
			<MediaPlayer src={filePath} type="audio/mp3" />
		);

		const expected = 'audio';
		const actual = mediaPlayer.instance().getMediaNode().media.tagName.toLowerCase();

		expect(actual).toBe(expected);
	});
});
