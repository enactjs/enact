/* global globalThis */

import {parseUserAgent, platform} from '../platform';

describe('platform', () => {

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
			[uaGenerator('Linux; Android 10; K', 'Mobile'), 'chrome']
		];

		test(`should return object including chrome ${testVersion}`, () => {
			for (let i = 0; i < testCases.length; i++) {
				expect(parseUserAgent(testCases[i][0])?.[testCases[i][1]]?.toString()).toBe(testVersion);
			}
		});
	});

	describe('parseUserAgent for Safari', () => {
		test('should detect Safari browsers', () => {
			const knownUserAgents = {
				userAgentList: [
					// Safari on macOS
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15'
				],
				expected: {type: 'desktop', browserName: 'safari', browserVersion: 17.3, safari: 17.3}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});

		test('should detect mobile Safari browsers', () => {
			const knownUserAgents = {
				//
				userAgentList: [
					// Safari on iPhone, iPad
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
					'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
					// Chrome on iPhone, iPad
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/121.0.6167.138 Mobile/15E148 Safari/604.1',
					'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/121.0.6167.138 Mobile/15E148 Safari/604.1',
					// Edge on iPhone
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/121.2277.99 Mobile/15E148 Safari/605.1.15',
					// Firefox on iPhone, iPad
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/122.0 Mobile/15E148 Safari/605.1.15',
					'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/122.0 Mobile/15E148 Safari/605.1.15'
				],
				expected: {type: 'mobile', browserName: 'safari', browserVersion: 17.3, safari: 17.3}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});
	});

	describe('parseUserAgent for Chrome', () => {
		test('should detect Chrome browsers', () => {
			const knownUserAgents = {
				// Chrome on Windows, macOS, Linux, Edge on Windows, macOS, respectively
				userAgentList: [
					// Chrome on Windows, macOS, Linux
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
					// Edge on Windows, macOS
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.98',
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.98'
				],
				expected: {type: 'desktop', browserName: 'chrome', browserVersion: 121, chrome: 121}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});

		test('should detect mobile Chrome browsers', () => {
			const knownUserAgents = {
				userAgentList: [
					// Chrome on Android
					'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36',
					// Edge on Android
					'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36 EdgA/120.0.2210.157'
				],
				expected: {type: 'mobile', browserName: 'chrome', browserVersion: 121, chrome: 121}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});
	});

	describe('parseUserAgent for Firefox', () => {
		test('should detect Firefox browsers', () => {
			const knownUserAgents = {
				userAgentList: [
					// Firefox on Windows, macOS, Linux
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.3; rv:122.0) Gecko/20100101 Firefox/122.0',
					'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0'
				],
				expected: {type: 'desktop', browserName: 'firefox', browserVersion: 122, firefox: 122}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});

		test('should detect mobile Firefox browsers', () => {
			const knownUserAgents = {
				userAgentList: [
					// Firefox on Android
					'Mozilla/5.0 (Android 14; Mobile; rv:122.0) Gecko/122.0 Firefox/122.0'
				],
				expected: {type: 'mobile', browserName: 'firefox', browserVersion: 122, firefox: 122}
			};

			for (let i = 0; i < knownUserAgents.userAgentList.length; i++) {
				const actual = parseUserAgent(knownUserAgents.userAgentList[i]);
				expect(actual).toMatchObject(knownUserAgents.expected);
			}
		});
	});

	describe('parseUserAgent for Chrome on webOS', () => {
		test('should detect Chrome browsers on webOS', () => {
			const knownUserAgent = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 WebAppManager';
			const expected = {type: 'webos', browserName: 'chrome', browserVersion: 108, chrome: 108};
			const actual = parseUserAgent(knownUserAgent);
			expect(actual).toMatchObject(expected);
		});
	});

	describe('platform', () => {
		test('should detect node environment if \'window\' does not exist', () => {
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => {});

			const expected = {
				type: 'node',
				browserName: 'unknown',
				browserVersion: 0
			};
			expect(platform).toMatchObject(expected);

			windowSpy.mockRestore();
		});

		test('should return `webos` for `type` in WebOSTV environment', () => {
			Object.defineProperty(globalThis.navigator, "userAgent", {
				value: 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 WebAppManager',
				configurable: true
			});

			expect(platform.type).toBe('webos');

			delete globalThis.navigator.userAgent;
		});
	});
});
