/* eslint-disable jest/valid-expect */
const Page = require('./LoaderPage');

// When running these tests manually in the browser, be sure to clear localStorage via dev tools or
// with window.localStorage.clear() to ensure that resources are loaded via the network and not the
// localStorage cache
describe('Loader', () => {
	describe('sync', () => {
		it('should load', async () => {
			await Page.open({sync: true, locale: 'ar-SA'});

			expect(await Page.loadState()).to.equal('Loaded');
		});

		it('should have specified locale', async () => {
			await Page.open({sync: true, locale: 'ar-SA'});

			expect(await Page.locale()).to.equal('ar-SA');
		});

		it('should have LTR text direction', async () => {
			await Page.open({sync: true, locale: 'en-US'});

			expect(await Page.textDirection()).to.equal('LTR');
		});

		it('should have RTL text direction', async () => {
			await Page.open({sync: true, locale: 'ar-SA'});

			expect(await Page.textDirection()).to.equal('RTL');
		});

		it('should have translated text for en-US', async () => {
			await Page.open({sync: true, locale: 'en-US'});

			expect(await Page.text()).to.equal('test-en');
		});

		it('should have translated text for ar-SA', async () => {
			await Page.open({sync: true, locale: 'ar-SA'});

			expect(await Page.text()).to.equal('test-ar');
		});
	});

	describe('async', function () {
		it('should load', async () => {
			await Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.loadState()).to.equal('Loaded');
		});

		it('should have specified locale', async () => {
			await Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.locale()).to.equal('ar-SA');
		});

		it('should have LTR text direction', async () => {
			await Page.open({sync: false, locale: 'en-US'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.textDirection()).to.equal('LTR');
		});

		it('should have RTL text direction', async () => {
			await Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.textDirection()).to.equal('RTL');
		});

		it('should have translated text for en-US', async () => {
			await Page.open({sync: false, locale: 'en-US'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.text()).to.equal('test-en');
		});

		it('should have translated text for ar-SA', async () => {
			await Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState() === 'Loaded', 500);
			expect(await Page.text()).to.equal('test-ar');
		});
	});
});
