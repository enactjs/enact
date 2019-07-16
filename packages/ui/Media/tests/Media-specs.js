import React from 'react';
import {mount} from 'enzyme';
import {getKeyFromSource, Media, PreloadDecorator} from '../Media';

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

	test(
		'should pass down the source element to mediaComponent',
		() => {
			const media = mount(
				<Media mediaComponent="video">
					<source src={filePath} />
				</Media>
			);

			const expected = filePath;
			const actual = media.find('source').prop('src');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should pass down all source elements to mediaComponent',
		() => {
			const media = mount(
				<Media mediaComponent="video">
					<source src={filePath} type="video/mp4" />
					<source src={filePath} type="video/3gpp" />
				</Media>
			);

			const expected = 2;
			const actual = media.find('source').length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should favor source over children',
		() => {
			const media = mount(
				<Media
					mediaComponent="video"
					source={
						<source src={filePath} type="video/mp4" />
					}
				>
					<source src={filePath} type="video/3gpp" />
				</Media>
			);

			const expected = 'video/mp4';
			const actual = media.find('source').prop('type');

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

	describe('PreloadDecorator', () => {
		// define `HTMLMediaElement.load` so that jsdom doesn't throw an error for preloading tests
		window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };

		test(
			'should have two video elements given a `source` and a `preloadSource`',
			() => {
				// eslint-disable-next-line no-unused-vars
				const Video = React.forwardRef((props, ref) => null);
				const Component = PreloadDecorator(Video);
				const mediaBase = mount(
					<Component source={filePath} preloadSource={`${filePath}2`} />
				);

				const expected = 2;
				const actual = mediaBase.find(Video).length;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should have two video elements given a `source` and a `preloadSource` with correct sources',
			() => {
				// eslint-disable-next-line no-unused-vars
				const Video = React.forwardRef(({source}, ref) => source);
				const Component = PreloadDecorator(Video);
				const concatenatedPaths = `${filePath}${filePath}2`;
				const mediaBase = mount(
					<Component source={filePath} preloadSource={`${filePath}2`} />
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

		test(
			'should have one video element given a `source` and a `preloadSource` with the same sources',
			() => {
				const Component = PreloadDecorator(Media);
				const mediaBase = mount(
					<Component mediaComponent="video" source={filePath} preloadSource={`${filePath}`} />
				);

				const expected = 1;
				const actual = mediaBase.find('video').length;

				expect(actual).toBe(expected);
			}
		);
	});

});
