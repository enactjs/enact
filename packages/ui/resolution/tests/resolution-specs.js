import {
	calculateFontSize,
	config,
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
		{name: 'qhd', pxPerRem: 32, width: 2560, height: 1440, aspectRatioName: 'hdtv'},
		{name: 'wqhd', pxPerRem: 32, width: 3440, height: 1440, aspectRatioName: 'cinema'},
		{name: 'uhd', pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'},
		{name: 'uhd2', pxPerRem: 96, width: 7680, height: 4320, aspectRatioName: 'hdtv'}
	];
	const VGA = {height: 480, width: 640};
	const XGA = {height: 768, width: 1024};
	const HD = {height: 720, width: 1280};
	const FHD = {height: 1080, width: 1920};
	const UWUXGA = {height: 1080, width: 2560};
	const QHD = {height: 1440, width: 2560};
	const WQHD = {height: 1440, width: 3440};
	const UHD = {height: 2160, width: 3840};
	const UHD2 = {height: 4320, width: 7680};

	defineScreenTypes(screenTypes);

	describe('Matching Screen Types', () => {
		test('should select screen type whose dimensions are same with the screen if exist', () => {
			expect(getScreenType(VGA)).toBe('vga');
			expect(getScreenType(XGA)).toBe('xga');
			expect(getScreenType(HD)).toBe('hd');
			expect(getScreenType(FHD)).toBe('fhd');
			expect(getScreenType(UWUXGA)).toBe('uw-uxga');
			expect(getScreenType(QHD)).toBe('qhd');
			expect(getScreenType(WQHD)).toBe('wqhd');
			expect(getScreenType(UHD)).toBe('uhd');
			expect(getScreenType(UHD2)).toBe('uhd2');
		});

		test('should select screen type whose height and width are both smaller than or same with the screen if `matchSmallerScreenType` true', () => {
			config.matchSmallerScreenType = true;

			// if height or width of screen is small than the smallest screen type, select the smallest screen type
			expect(getScreenType({height: VGA.height - 1, width: VGA.width - 1})).toBe('vga');
			expect(getScreenType({height: VGA.height - 1, width: VGA.width + 1})).toBe('vga');
			expect(getScreenType({height: VGA.height + 1, width: VGA.width - 1})).toBe('vga');

			// VGA
			expect(getScreenType({height: VGA.height + 1, width: VGA.width + 1})).toBe('vga');

			expect(getScreenType({height: XGA.height - 1, width: XGA.width - 1})).toBe('vga');
			expect(getScreenType({height: XGA.height - 1, width: XGA.width + 1})).toBe('vga');
			expect(getScreenType({height: XGA.height + 1, width: XGA.width - 1})).toBe('vga');

			expect(getScreenType({height: HD.height - 1, width: HD.width - 1})).toBe('vga');
			expect(getScreenType({height: HD.height - 1, width: HD.width + 1})).toBe('vga');
			expect(getScreenType({height: HD.height + 1, width: HD.width - 1})).toBe('vga');

			expect(getScreenType({height: HD.height, width: XGA.width})).toBe('vga');
			expect(getScreenType({height: HD.height - 1, width: XGA.width - 1})).toBe('vga');
			expect(getScreenType({height: HD.height - 1, width: XGA.width + 1})).toBe('vga');
			expect(getScreenType({height: HD.height + 1, width: XGA.width - 1})).toBe('vga');
			expect(getScreenType({height: HD.height + 1, width: XGA.width + 1})).toBe('vga');

			expect(getScreenType({height: XGA.height - 1, width: HD.width - 1})).toBe('vga');

			// XGA
			expect(getScreenType({height: XGA.height + 1, width: XGA.width + 1})).toBe('xga');
			expect(getScreenType({height: XGA.height + 1, width: HD.width - 1})).toBe('xga');

			// HD
			expect(getScreenType({height: HD.height + 1, width: HD.width + 1})).toBe('hd');

			expect(getScreenType({height: XGA.height, width: HD.width})).toBe('hd');
			expect(getScreenType({height: XGA.height - 1, width: HD.width + 1})).toBe('hd');
			expect(getScreenType({height: XGA.height + 1, width: HD.width + 1})).toBe('hd');

			expect(getScreenType({height: FHD.height - 1, width: FHD.width - 1})).toBe('hd');
			expect(getScreenType({height: FHD.height - 1, width: FHD.width + 1})).toBe('hd');
			expect(getScreenType({height: FHD.height + 1, width: FHD.width - 1})).toBe('hd');

			expect(getScreenType({height: UWUXGA.height - 1, width: UWUXGA.width - 1})).toBe('hd');  // {height: FHD.height - 1, width: UWUXGA.width - 1}
			expect(getScreenType({height: UWUXGA.height - 1, width: UWUXGA.width + 1})).toBe('hd');  // {height: FHD.height - 1, width: UWUXGA.width + 1}

			// FHD
			expect(getScreenType({height: FHD.height + 1, width: FHD.width + 1})).toBe('fhd');

			expect(getScreenType({height: UWUXGA.height + 1, width: UWUXGA.width - 1})).toBe('fhd');  // {height: FHD.height + 1, width: UWUXGA.width - 1}

			expect(getScreenType({height: QHD.height - 1, width: QHD.width - 1})).toBe('fhd');  // {height: QHD.height - 1, width: UWUXGA.width - 1}
			expect(getScreenType({height: QHD.height + 1, width: QHD.width - 1})).toBe('fhd');  // {height: QHD.height + 1, width: UWUXGA.width - 1}

			// UWUXGA
			expect(getScreenType({height: UWUXGA.height + 1, width: UWUXGA.width + 1})).toBe('uw-uxga');  // {height: FHD.height + 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: QHD.height - 1, width: QHD.width + 1})).toBe('uw-uxga');  // {height: QHD.height - 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: WQHD.height - 1, width: WQHD.width - 1})).toBe('uw-uxga');  // {height: QHD.height - 1, width: WQHD.width - 1}
			expect(getScreenType({height: WQHD.height - 1, width: WQHD.width + 1})).toBe('uw-uxga');  // {height: QHD.height - 1, width: WQHD.width + 1}

			// QHD
			expect(getScreenType({height: QHD.height + 1, width: QHD.width + 1})).toBe('qhd');  // {height: QHD.height + 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: WQHD.height + 1, width: WQHD.width - 1})).toBe('qhd');  // {height: QHD.height + 1, width: WQHD.width - 1}

			// WQHD
			expect(getScreenType({height: WQHD.height + 1, width: WQHD.width + 1})).toBe('wqhd');  // {height: QHD.height + 1, width: WQHD.width + 1}

			expect(getScreenType({height: UHD.height - 1, width: UHD.width - 1})).toBe('wqhd');
			expect(getScreenType({height: UHD.height - 1, width: UHD.width + 1})).toBe('wqhd');
			expect(getScreenType({height: UHD.height + 1, width: UHD.width - 1})).toBe('wqhd');

			// UHD
			expect(getScreenType({height: UHD.height + 1, width: UHD.width + 1})).toBe('uhd');

			expect(getScreenType({height: UHD2.height - 1, width: UHD2.width - 1})).toBe('uhd');
			expect(getScreenType({height: UHD2.height - 1, width: UHD2.width + 1})).toBe('uhd');
			expect(getScreenType({height: UHD2.height + 1, width: UHD2.width - 1})).toBe('uhd');

			// UHD2
			expect(getScreenType({height: UHD2.height + 1, width: UHD2.width + 1})).toBe('uhd2');
		});

		test('should select screen type whose height and width are both bigger than or same with the screen if `matchSmallerScreenType` false', () => {
			config.matchSmallerScreenType = false;

			// VGA
			expect(getScreenType({height: VGA.height - 1, width: VGA.width - 1})).toBe('vga');

			// XGA
			expect(getScreenType({height: VGA.height - 1, width: VGA.width + 1})).toBe('xga');
			expect(getScreenType({height: VGA.height + 1, width: VGA.width - 1})).toBe('xga');
			expect(getScreenType({height: VGA.height + 1, width: VGA.width + 1})).toBe('xga');

			expect(getScreenType({height: XGA.height - 1, width: XGA.width - 1})).toBe('xga');

			expect(getScreenType({height: HD.height, width: XGA.width})).toBe('xga');
			expect(getScreenType({height: HD.height - 1, width: XGA.width - 1})).toBe('xga');
			expect(getScreenType({height: HD.height + 1, width: XGA.width - 1})).toBe('xga');

			// HD
			expect(getScreenType({height: HD.height - 1, width: XGA.width + 1})).toBe('hd');

			expect(getScreenType({height: HD.height - 1, width: HD.width - 1})).toBe('hd');

			// FHD
			expect(getScreenType({height: XGA.height - 1, width: XGA.width + 1})).toBe('fhd');
			expect(getScreenType({height: XGA.height + 1, width: XGA.width - 1})).toBe('fhd');
			expect(getScreenType({height: XGA.height + 1, width: XGA.width + 1})).toBe('fhd');

			expect(getScreenType({height: XGA.height, width: HD.width})).toBe('fhd');
			expect(getScreenType({height: XGA.height - 1, width: HD.width - 1})).toBe('fhd');
			expect(getScreenType({height: XGA.height - 1, width: HD.width + 1})).toBe('fhd');
			expect(getScreenType({height: XGA.height + 1, width: HD.width - 1})).toBe('fhd');
			expect(getScreenType({height: XGA.height + 1, width: HD.width + 1})).toBe('fhd');

			expect(getScreenType({height: HD.height + 1, width: XGA.width + 1})).toBe('fhd');

			expect(getScreenType({height: HD.height - 1, width: HD.width + 1})).toBe('fhd');
			expect(getScreenType({height: HD.height + 1, width: HD.width - 1})).toBe('fhd');
			expect(getScreenType({height: HD.height + 1, width: HD.width + 1})).toBe('fhd');

			expect(getScreenType({height: FHD.height - 1, width: FHD.width - 1})).toBe('fhd');

			// UWUXGA
			expect(getScreenType({height: UWUXGA.height - 1, width: UWUXGA.width - 1})).toBe('uw-uxga');  // {height: FHD.height - 1, width: UWUXGA.width - 1}

			expect(getScreenType({height: FHD.height - 1, width: FHD.width + 1})).toBe('uw-uxga');

			// QHD
			expect(getScreenType({height: UWUXGA.height + 1, width: UWUXGA.width - 1})).toBe('qhd');  // {height: FHD.height + 1, width: UWUXGA.width - 1}

			expect(getScreenType({height: QHD.height - 1, width: QHD.width - 1})).toBe('qhd');  // {height: QHD.height - 1, width: UWUXGA.width - 1}

			expect(getScreenType({height: FHD.height + 1, width: FHD.width - 1})).toBe('qhd');
			expect(getScreenType({height: FHD.height + 1, width: FHD.width + 1})).toBe('qhd');

			// WQHD
			expect(getScreenType({height: UWUXGA.height - 1, width: UWUXGA.width + 1})).toBe('wqhd');  // {height: FHD.height - 1, width: UWUXGA.width + 1}
			expect(getScreenType({height: UWUXGA.height + 1, width: UWUXGA.width + 1})).toBe('wqhd');  // {height: FHD.height + 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: QHD.height - 1, width: QHD.width + 1})).toBe('wqhd');  // {height: QHD.height - 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: WQHD.height - 1, width: WQHD.width - 1})).toBe('wqhd');  // {height: QHD.height - 1, width: WQHD.width - 1}

			// UHD
			expect(getScreenType({height: QHD.height + 1, width: QHD.width - 1})).toBe('uhd');  // {height: QHD.height + 1, width: UWUXGA.width - 1}
			expect(getScreenType({height: QHD.height + 1, width: QHD.width + 1})).toBe('uhd');  // {height: QHD.height + 1, width: UWUXGA.width + 1}

			expect(getScreenType({height: WQHD.height - 1, width: WQHD.width + 1})).toBe('uhd');  // {height: QHD.height - 1, width: WQHD.width + 1}
			expect(getScreenType({height: WQHD.height + 1, width: WQHD.width - 1})).toBe('uhd');  // {height: QHD.height + 1, width: WQHD.width - 1}
			expect(getScreenType({height: WQHD.height + 1, width: WQHD.width + 1})).toBe('uhd');  // {height: QHD.height + 1, width: WQHD.width + 1}

			expect(getScreenType({height: UHD.height - 1, width: UHD.width - 1})).toBe('uhd');

			// UHD2
			expect(getScreenType({height: UHD.height - 1, width: UHD.width + 1})).toBe('uhd2');
			expect(getScreenType({height: UHD.height + 1, width: UHD.width - 1})).toBe('uhd2');
			expect(getScreenType({height: UHD.height + 1, width: UHD.width + 1})).toBe('uhd2');

			expect(getScreenType({height: UHD2.height - 1, width: UHD2.width - 1})).toBe('uhd2');

			// if height or width of screen is bigger than the biggest screen type, select the biggest screen type
			expect(getScreenType({height: UHD2.height - 1, width: UHD2.width + 1})).toBe('uhd2');
			expect(getScreenType({height: UHD2.height + 1, width: UHD2.width - 1})).toBe('uhd2');
			expect(getScreenType({height: UHD2.height + 1, width: UHD2.width + 1})).toBe('uhd2');
		});
	});

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
