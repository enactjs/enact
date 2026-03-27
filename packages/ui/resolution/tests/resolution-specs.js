import {
	calculateFontSize,
	defineScreenTypes,
	getScreenType,
	init,
	scale,
	selectSrc,
	unit
} from '../resolution.js';

describe('Resolution Specs', () => {
	const screenTypes = [
		{name: 'vga', pxPerRem: 8, width: 640, height: 480, aspectRatioName: 'standard'},
		{name: 'xga', pxPerRem: 16, width: 1024, height: 768, aspectRatioName: 'standard'},
		{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv'},
		{name: 'uw-hd', pxPerRem: 16, width: 1920, height: 804, aspectRatioName: 'cinema'},
		{name: 'fhd', pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv'},
		{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
		{name: 'qhd', pxPerRem: 32, width: 2560, height: 1440, aspectRatioName: 'hdtv'},
		{name: 'wqhd', pxPerRem: 32, width: 3440, height: 1440, aspectRatioName: 'cinema'},
		{name: 'uhd', pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv', base: true},
		{name: 'wuhd', pxPerRem: 48, width: 5158, height: 2160, aspectRatioName: 'cinema'},
		{name: 'uhd2', pxPerRem: 96, width: 7680, height: 4320, aspectRatioName: 'hdtv'}
	];
	const VGA = {width: 640, height: 480};
	const XGA = {width: 1024, height: 768};
	const HD = {width: 1280, height: 720};
	const UWHD = {width: 1920, height: 804};
	const FHD = {width: 1920, height: 1080};
	const UWUXGA = {width: 2560, height: 1080};
	const QHD = {width: 2560, height: 1440};
	const WQHD = {width: 3440, height: 1440};
	const UHD = {width: 3840, height: 2160};
	const WUHD = {width: 5158, height: 2160};
	const UHD2 = {width: 7680, height: 4320};

	defineScreenTypes(screenTypes);

	describe('Matching Screen Types', () => {
		test('should select screen type whose dimensions are same with the screen if exist', () => {
			expect(getScreenType(VGA)).toBe('vga');
			expect(getScreenType(XGA)).toBe('xga');
			expect(getScreenType(HD)).toBe('hd');
			expect(getScreenType(UWHD)).toBe('uw-hd');
			expect(getScreenType(FHD)).toBe('fhd');
			expect(getScreenType(UWUXGA)).toBe('uw-uxga');
			expect(getScreenType(QHD)).toBe('qhd');
			expect(getScreenType(WQHD)).toBe('wqhd');
			expect(getScreenType(UHD)).toBe('uhd');
			expect(getScreenType(WUHD)).toBe('wuhd');
			expect(getScreenType(UHD2)).toBe('uhd2');
		});

		test('should select screen type whose height and width are the closest to the screen', () => {
			screenTypes.forEach((type) => {
				expect(getScreenType({width: type.width, height: type.height})).toBe(type.name);

				expect(getScreenType({width: type.width - 1, height: type.height - 1})).toBe(type.name);
				expect(getScreenType({width: type.width + 1, height: type.height + 1})).toBe(type.name);
			});

			for (let i = 0; i < screenTypes.length - 1; i++) {
				const current = screenTypes[i];
				const next = screenTypes[i + 1];

				const midPoint = {
					width: (current.width + next.width) / 2,
					height: (current.height + next.height) / 2
				};

				const justBeforeMid = {
					width: Math.floor(midPoint.width - 0.1),
					height: Math.floor(midPoint.height - 0.1)
				};

				const justAfterMid = {
					width: Math.ceil(midPoint.width + 0.1),
					height: Math.ceil(midPoint.height + 0.1)
				};

				expect(getScreenType(justBeforeMid)).toBe(current.name);
				expect(getScreenType(justAfterMid)).toBe(next.name);
			}

			const firstScreenType = screenTypes.at(0);
			expect(getScreenType({width: 1, height: 1})).toBe(firstScreenType.name);

			const lastType = screenTypes.at(-1);
			expect(getScreenType({width: lastType.width + 1000, height: lastType.height + 1000})).toBe(lastType.name);
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
			const expectedUHD = '48px';
			const actualUHD = calculateFontSize('uhd');

			const expectedQHD = '32px';
			const actualQHD = calculateFontSize('qhd');

			const expectedFHD = '24px';
			const actualFHD = calculateFontSize('fhd');

			const expectedHD = '16px';
			const actualHD = calculateFontSize('hd');

			expect(actualUHD).toBe(expectedUHD);
			expect(actualQHD).toBe(expectedQHD);
			expect(actualFHD).toBe(expectedFHD);
			expect(actualHD).toBe(expectedHD);
		}
	);

	test('should scale pixel measurements for the current screen', () => {
		const expectedFHD = 24 / 6;
		const actualFHD = scale(24);

		const expectedHD = 16 / 6;
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

	test('should select source for the current screen type', function () {
		let measurementNode;
		const src = {vga: 'VGA', hd: 'HD', fhd: 'FHD', uhd: 'UHD'};
		const stringSrc = 'src/to/image';

		// String src
		expect(selectSrc(stringSrc)).toBe(stringSrc);

		// VGA
		measurementNode = {innerWidth: VGA.width, innerHeight: VGA.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.vga);

		// XGA
		measurementNode = {innerWidth: XGA.width, innerHeight: XGA.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.hd);

		// HD
		measurementNode = {innerWidth: HD.width, innerHeight: HD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.hd);

		// UWHD
		measurementNode = {innerWidth: UWHD.width, innerHeight: UWHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.fhd);

		// FHD
		measurementNode = {innerWidth: FHD.width, innerHeight: FHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.fhd);

		// UWUXGA
		measurementNode = {innerWidth: UWUXGA.width, innerHeight: UWUXGA.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.fhd);

		// QHD
		measurementNode = {innerWidth: QHD.width, innerHeight: QHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.fhd);

		// WQHD
		measurementNode = {innerWidth: WQHD.width, innerHeight: WQHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.uhd);

		// UHD
		measurementNode = {innerWidth: UHD.width, innerHeight: UHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.uhd);

		// WUHD
		measurementNode = {innerWidth: WUHD.width, innerHeight: WUHD.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.uhd);

		// UHD2
		measurementNode = {innerWidth: UHD2.width, innerHeight: UHD2.height};
		init({measurementNode});
		expect(selectSrc(src)).toBe(src.uhd);
	});

	test('should calculate linearly scaled font size based on workspace bounds and current screen', () => {
		screenTypes.forEach((type, index, arr) => {
			init({measurementNode: {innerWidth: type.width, innerHeight: type.height}});
			let actual = calculateFontSize();
			expect(actual).toBe(type.pxPerRem + 'px');

			init({measurementNode: {innerWidth: type.width - 10, innerHeight: type.height - 10}});
			actual = Number(calculateFontSize().split('px').at(0));
			expect(actual).toBeLessThan(type.pxPerRem);

			init({measurementNode: {innerWidth: type.width + 10, innerHeight: type.height + 10}});
			actual = Number(calculateFontSize().split('px').at(0));

			const expectCondition = arr.length - 1 === index ? 'toEqual' : 'toBeGreaterThan';
			expect(actual)[expectCondition](type.pxPerRem);
		});
	});
});
