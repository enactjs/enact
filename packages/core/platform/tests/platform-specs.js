import {parseUserAgent, platform} from '../platform';

describe('platform', () => {

	describe('parseUserAgent for webOS', () => {
		// From http://webostv.developer.lge.com/discover/specifications/web-engine/
		const webOSTVNext = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 WebAppManager';
		const webOSTV6 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3440.106 Safari/537.36 WebAppManager';
		const webOSTV5 = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 WebAppManager';
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

		const webOSOther = 'Mozilla/5.0 (Web0S; Linux) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 WebAppManager';

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

		test('should return webOS 5', () => {
			const expected = {webos: 5};
			const actual = parseUserAgent(webOSTV5);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS 6', () => {
			const expected = {webos: 6};
			const actual = parseUserAgent(webOSTV6);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS Next and chrome 87', () => {
			const expected = {webos: -1, chrome: 87};
			const actual = parseUserAgent(webOSTVNext);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS -1', () => {
			const expected = {webos: -1};
			const actual = parseUserAgent(webOSOther);

			expect(actual).toMatchObject(expected);
		});

		test('should return webOS -1 + LuneOS 1', () => {
			const expected = {webos: -1, luneos: 1};

			expect(parseUserAgent(LuneOS1)).toMatchObject(expected);
			expect(parseUserAgent(LuneOS2)).toMatchObject(expected);
		});

		test('should return webOS -1 + legacy 1', () => {
			const expected = {webos: -1, legacy: 1};

			expect(parseUserAgent(webOS10)).toMatchObject(expected);
			expect(parseUserAgent(webOS11)).toMatchObject(expected);
			expect(parseUserAgent(webOS12)).toMatchObject(expected);
			expect(parseUserAgent(webOS13)).toMatchObject(expected);
			expect(parseUserAgent(webOS1351)).toMatchObject(expected);
		});

		test('should return webOS -1 + legacy 2', () => {
			const expected = {webos: -1, legacy: 2};

			expect(parseUserAgent(webOS2)).toMatchObject(expected);
		});
	});

	describe('parseUserAgent for Windows Phone', () => {
		const windowsPhone = 'Mozilla/5.0 (Windows Phone 8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4103.84 Mobile Safari/537.36';

		test('should return platformName `windowsPhone`', () => {
			const expected = {platformName: 'windowsPhone'};
			const actual = parseUserAgent(windowsPhone);

			expect(actual).toMatchObject(expected);
		});
	});

	describe('parseUserAgent for Edge', () => {
		const edge1 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42';
		const edge2 = 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.76 Mobile Safari/537.36 EdgA/113.0.1774.38';
		const edge3 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 EdgiOS/113.1774.42 Mobile/15E148 Safari/605.1.15';
		const edge4 = 'Mozilla/5.0 (Windows Mobile 10; Android 10.0; Microsoft; Lumia 950XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36 Edge/40.15254.603';

		test('should return edge for Edg', () => {
			const expectd = {platformName: 'edge'};
			const actual = parseUserAgent(edge1);

			expect(actual).toMatchObject(expectd);
		});

		test('should return edge for EdgA', () => {
			const expectd = {platformName: 'edge'};
			const actual = parseUserAgent(edge2);

			expect(actual).toMatchObject(expectd);
		});

		test('should return edge for EdgiOS', () => {
			const expectd = {platformName: 'edge'};
			const actual = parseUserAgent(edge3);

			expect(actual).toMatchObject(expectd);
		});

		test('should return edge for Edge', () => {
			const expectd = {platformName: 'edge'};
			const actual = parseUserAgent(edge4);

			expect(actual).toMatchObject(expectd);
		});
	});

	describe('parseUserAgent for User-Agent Reduction', () => {
		const testVersion = '113';
		const uaGenerator = (unifiedPlatform, deviceCompatibility = '', majorVersion = testVersion) => (
			`Mozilla/5.0 (${unifiedPlatform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${majorVersion}.0.0.0 ${deviceCompatibility} Safari/537.36`
		);
		const testCases = [
			[uaGenerator('Macintosh; Intel Mac OS X 10_15_7'), 'chrome'],
			[uaGenerator('Windows NT 10.0; Win64; x64'), 'chrome'],
			[uaGenerator('X11; Linux x86_64'), 'chrome'],
			[uaGenerator('X11; CrOS x86_64 14541.0.0'), 'chrome'],
			[uaGenerator('Fuchsia'), 'chrome'],
			[uaGenerator('Linux; Android 10; K', 'Mobile'), 'androidChrome']
		];

		test(`should return object including chrome ${testVersion}`, () => {
			for (let i = 0; i < testCases.length; i++) {
				expect(parseUserAgent(testCases[i][0])?.[testCases[i][1]]?.toString()).toBe(testVersion);
			}
		});
	});

	describe('platform', () => {
		test('should return `true` for `node` if window does not exist', () => {
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => {});

			expect(platform['node']).toBe(true);

			windowSpy.mockRestore();
		});

		test('should return `true` for `unknown` in the testing environment', () => {
			// The first access invokes detecting based on user agent value
			expect(platform['unknown']).toBe(true);
			// The second access makes the module to return already detected platform information
			expect(platform['unknown']).toBe(true);
		});
	});
});
