import {
	calculateFontSize,
	defineScreenTypes,
	getScreenType,
	scale,
	unit
} from '../resolution.js';

describe('Resolution Specs', () => {
	const screenTypes = [
		{name: 'vga', pxPerRem: 8, width: 640, height: 480, aspectRatioName: 'standard'},
		{name: 'xga', pxPerRem: 16, width: 1024, height: 768, aspectRatioName: 'standard'},
		{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv'},
		{name: 'fhd', pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv', base: true},
		{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
		{name: 'uhd', pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'}
	];

	test(
		'should select screen type whose dimensions are greater than but nearest to the screen',
		() => {
			const overHD = {
				height: 721,
				width: 1281
			};

			defineScreenTypes(screenTypes);

			const expected = 'fhd';
			const actual = getScreenType(overHD);

			expect(actual).toBe(expected);
		}
	);

	test('should detect portrait orientation', () => {
		const fhdPortrait = {
			height: 1920,
			width: 1080
		};

		defineScreenTypes(screenTypes);

		const expected = 'fhd';
		const actual = getScreenType(fhdPortrait);

		expect(actual).toBe(expected);
	});

	test(
		'should calculate the base font size for the given screen type',
		() => {
			const expectedFHD = '24px';
			const actualFHD = calculateFontSize('fhd');

			const expectedHD = '16px';
			const actualHD = calculateFontSize('hd');

			expect(actualFHD).toBe(expectedFHD);
			expect(actualHD).toBe(expectedHD);
		}
	);

	test('should scale pixel measurements for the current screen', () => {
		const expectedFHD = 24 / 3;
		const actualFHD = scale(24);

		const expectedHD = 16 / 3;
		const actualHD = scale(16);

		expect(actualFHD).toBe(expectedFHD);
		expect(actualHD).toBe(expectedHD);
	});

	test('should convert pixels to units', () => {
		const expectedFHD = '3rem';
		const actualFHD = unit(24, 'rem');

		const expectedHD = '2rem';
		const actualHD = unit(16, 'rem');

		expect(actualFHD).toBe(expectedFHD);
		expect(actualHD).toBe(expectedHD);
	});

	// NOTE: Currently tough to test selectSrc because it relies on a global variable for screenType
	test.skip('should select source for the current screen type', function () {

	});

});
