import React from 'react';
import {mount} from 'enzyme';
import {getKeyFromSource, Media, MediaBase} from '../Media';

describe('Media', () => {
	const filePath = 'path/file.mp4';

	test('should be an audio element when `mediaComponent="audio"`', () => {
		const media = mount(
			<Media mediaComponent="audio" />
		);

		const expected = 1;
		const actual = media.find('audio').length;

		expect(actual).toBe(expected);
	});

	test(
		'should be an video element when `mediaComponent="video"`',
		() => {
			const media = mount(
				<Media mediaComponent="video" />
			);

			const expected = 1;
			const actual = media.find('video').length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should pass down the src prop to mediaComponent',
		() => {
			const media = mount(
				<Media mediaComponent="video" src={filePath} />
			);

			const expected = filePath;
			const actual = media.find('video').prop('src');

			expect(actual).toBe(expected);
		}
	);

	describe('getKeyFromSource', () => {

		test(
			'should return file path string from a string`',
			() => {
				const output = getKeyFromSource(filePath);

				const expected = filePath;
				const actual = output;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should return file path string from an element`',
			() => {
				const element = (<source src={filePath} type="video/mp4" />);

				const output = getKeyFromSource(element);

				const expected = filePath;
				const actual = output;

				expect(actual).toBe(expected);
			}
		);
	});

	describe('MediaBase', () => {
		// define `HTMLMediaElement.load` so that jsdom doesn't complain during the `MediaBase` steps
		window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };

		test(
			'should have two video elements given a `source` and a `preloadSource`',
			() => {
				const mediaBase = mount(
					<MediaBase mediaComponent="video" source={filePath} preloadSource={`${filePath}2`} />
				);

				const expected = 2;
				const actual = mediaBase.find('video').length;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should have two video elements given a `source` and a `preloadSource` with correct sources',
			() => {
				const concatenatedPaths = `${filePath}${filePath}2`;
				const mediaBase = mount(
					<MediaBase mediaComponent="video" source={filePath} preloadSource={`${filePath}2`} />
				);
				const sourceElements = mediaBase.find('source');
				const outputPaths = sourceElements.reduce(
					(outputString, sourceElement) => outputString + (sourceElement.prop('src')),
					''
				);

				const expected = concatenatedPaths;
				const actual = outputPaths;

				expect(actual).toBe(expected);
			}
		);
	});

});
