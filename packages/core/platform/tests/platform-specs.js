import {parseUserAgent} from '../platform';

describe('platform', () => {

	describe('webOS', () => {
		// From http://webostv.developer.lge.com/discover/specifications/web-engine/
		const webOSTV4 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.1785.34 Safari/537.36 WebAppManager';
		const webOSTV3 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.1.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager';
		const webOSTV2 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/538.2 (KHTML, like Gecko) Large Screen WebAppManager Safari/538.2';
		const webOSTV1 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.41 (KHTML, like Gecko) Large Screen WebAppManager Safari/537.41';

		// From https://developers.whatismybrowser.com/useragents/explore/operating_system_name/webos/
		const LuneOS2 = 'Mozilla/5.0 (LuneOS, like webOS/3.0.5; Tablet) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.9.2 Chrome/56.0.2924.103 Safari/537.36';
		const LuneOS1 = 'Mozilla/5.0 (LuneOS, like webOS/3.0.5; Tablet) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.6.2 Chrome/45.0.2454.103 Safari/537.36';
		const webOS10 = 'Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Geko) Version/1.0 Safari/525.27.1 Pre/1.0';
		const webOS11 = 'Mozilla/5.0 (webOS/1.1; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0';
		const webOS12 = 'Mozilla/5.0 (webOS/1.2; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0';
		const webOS13 = 'Mozilla/5.0 (webOS/1.3.1; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0';
		const webOS1351 = 'Mozilla/5.0 (webOS/1.3.5.1; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.1';
		const webOS2 = 'Mozilla/5.0 (webOS/2.0.1; U; en-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.2';

		test('should return webOS 1', () => {
			const expected = {webos: 1};
			const actual = parseUserAgent(webOSTV1);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS 2', () => {
			const expected = {webos: 2};
			const actual = parseUserAgent(webOSTV2);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS 3', () => {
			const expected = {webos: 3};
			const actual = parseUserAgent(webOSTV3);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS 4', () => {
			const expected = {webos: 4};
			const actual = parseUserAgent(webOSTV4);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS 0 + LuneOS 1', () => {
			const expected = {webos: 0, luneos: 1};

			expect(parseUserAgent(LuneOS1)).toMatchObject(expected);
			expect(parseUserAgent(LuneOS2)).toMatchObject(expected);
		});

		test('should return webOS 0 + legacy 1', () => {
			const expected = {webos: 0, legacy: 1};

			expect(parseUserAgent(webOS10)).toMatchObject(expected);
			expect(parseUserAgent(webOS11)).toMatchObject(expected);
			expect(parseUserAgent(webOS12)).toMatchObject(expected);
			expect(parseUserAgent(webOS13)).toMatchObject(expected);
			expect(parseUserAgent(webOS1351)).toMatchObject(expected);
		});

		test('should return webOS 0 + legacy 2', () => {
			const expected = {webos: 0, legacy: 2};

			expect(parseUserAgent(webOS2)).toMatchObject(expected);
		});
	});
});