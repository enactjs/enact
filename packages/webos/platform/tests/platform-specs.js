import {parseUserAgent} from '../platform';

describe('platform', () => {

	describe('parseUserAgent for webOS', () => {
		// From http://webostv.developer.lge.com/discover/specifications/web-engine/
		const webOSTV1 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.41 (KHTML, like Gecko) Large Screen WebAppManager Safari/537.41';
		const webOSTV2 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/538.2 (KHTML, like Gecko) Large Screen WebAppManager Safari/538.2';
		const webOSTV3 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager';
		const webOSTV4 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.34 Safari/537.36 WebAppManager';
		const webOSTV5 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 WebAppManager';
		const webOSTV6 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 WebAppManager';
		const webOSTV22 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 WebAppManager';
		const webOSTV23 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.128 Safari/537.36 WebAppManager';
		const webOSTVChrome = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 WebAppManager';
		const webOSOther = 'Mozilla/5.0 (Web0S; Linux) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 WebAppManager';

		test('should detect webOS 1', () => {
			const expected = {version: 1};
			const actual = parseUserAgent(webOSTV1);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 2', () => {
			const expected = {version: 2};
			const actual = parseUserAgent(webOSTV2);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 3', () => {
			const expected = {version: 3};
			const actual = parseUserAgent(webOSTV3);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 4', () => {
			const expected = {version: 4};
			const actual = parseUserAgent(webOSTV4);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 5', () => {
			const expected = {version: 5};
			const actual = parseUserAgent(webOSTV5);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 6', () => {
			const expected = {version: 6};
			const actual = parseUserAgent(webOSTV6);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 22', () => {
			const expected = {version: 22, chrome: 87};
			const actual = parseUserAgent(webOSTV22);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS 23', () => {
			const expected = {version: 23, chrome: 94};
			const actual = parseUserAgent(webOSTV23);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS with Chrome', () => {
			const expected = {chrome: 108};
			const actual = parseUserAgent(webOSTVChrome);

			expect(actual).toMatchObject(expected);
		});

		test('should detect webOS without Chrome', () => {
			const expected = {open: true};
			const actual = parseUserAgent(webOSOther);

			expect(actual).toMatchObject(expected);
		});
	});
});
