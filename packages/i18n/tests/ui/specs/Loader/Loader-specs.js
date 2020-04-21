const Page = require('./LoaderPage');

// When running these tests manually in the browser, be sure to clear localStorage via dev tools or
// with window.localStorage.clear() to ensure that resources are loaded via the network and not the
// localStorage cache
describe('Loader', function () {
	describe('sync', function () {
		it('should load', function () {
			Page.open({sync: true, locale: 'ar-SA'});

			expect(Page.loadState).to.equal('Loaded');
		});

		it('should have specified locale', function () {
			Page.open({sync: true, locale: 'ar-SA'});

			expect(Page.locale).to.equal('ar-SA');
		});

		it('should have LTR text direction', function () {
			Page.open({sync: true, locale: 'en-US'});

			expect(Page.textDirection).to.equal('LTR');
		});

		it('should have RTL text direction', function () {
			Page.open({sync: true, locale: 'ar-SA'});

			expect(Page.textDirection).to.equal('RTL');
		});

		it('should have translated text for en-US', function () {
			Page.open({sync: true, locale: 'en-US'});

			expect(Page.text).to.equal('test-en');
		});

		it('should have translated text for ar-SA', function () {
			Page.open({sync: true, locale: 'ar-SA'});

			expect(Page.text).to.equal('test-ar');
		});
	});

	describe('async', function () {
		it('should load', function () {
			Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.loadState).to.equal('Loaded');
		});

		it('should have specified locale', function () {
			Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.locale).to.equal('ar-SA');
		});

		it('should have LTR text direction', function () {
			Page.open({sync: false, locale: 'en-US'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.textDirection).to.equal('LTR');
		});

		it('should have RTL text direction', function () {
			Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.textDirection).to.equal('RTL');
		});

		it('should have translated text for en-US', function () {
			Page.open({sync: false, locale: 'en-US'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.text).to.equal('test-en');
		});

		it('should have translated text for ar-SA', function () {
			Page.open({sync: false, locale: 'ar-SA'});

			browser.waitUntil(() => Page.loadState === 'Loaded', 500);
			expect(Page.text).to.equal('test-ar');
		});
	});

});
