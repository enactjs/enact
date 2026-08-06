import {updateLocale} from '../../locale';
import {I18n} from '../I18n';

describe('I18n', () => {
	// Suite-wide setup
	beforeEach(() => {
		updateLocale('en-US');
	});

	afterEach(() => {
		updateLocale();
	});

	describe('normalizeResources', () => {
		test('should omit falsy entries', () => {
			const validResource = jest.fn();
			const i18n = new I18n({resources: [null, validResource]});

			expect(i18n.resources).toHaveLength(1);
			expect(i18n.resources[0].resource).toBe(validResource);
		});

		test('should omit entries whose resource is not a function', () => {
			const validResource = jest.fn();
			const i18n = new I18n({resources: [{resource: 'not-a-function'}, validResource]});

			expect(i18n.resources).toHaveLength(1);
			expect(i18n.resources[0].resource).toBe(validResource);
		});

		test('should accept a function-form resource entry', () => {
			const fn = jest.fn();
			const i18n = new I18n({resources: [fn]});

			expect(i18n.resources[0].resource).toBe(fn);
		});

		test('should accept an object-form resource entry with an onLoad callback', () => {
			const fn = jest.fn();
			const onLoad = jest.fn();
			const i18n = new I18n({resources: [{resource: fn, onLoad}]});

			expect(i18n.resources[0]).toEqual({resource: fn, onLoad});
		});
	});

	describe('custom resource loaders', () => {
		test('should invoke a sync resource loader and its onLoad callback', () => {
			const resource = jest.fn(() => 'customResult');
			const onLoad = jest.fn();
			const i18n = new I18n({resources: [{resource, onLoad}], sync: true});

			i18n.setContext('en-US');

			expect(resource).toHaveBeenCalled();
			expect(onLoad).toHaveBeenCalledWith('customResult');
		});

		test('should invoke an async resource loader and its onLoad callback', async () => {
			const resource = jest.fn(({onLoad: report}) => report('customResult'));
			const onLoad = jest.fn();
			const i18n = new I18n({resources: [{resource, onLoad}], sync: false});

			i18n.setContext('en-US');
			i18n.load();

			await new Promise(process.nextTick);

			expect(resource).toHaveBeenCalled();
			expect(onLoad).toHaveBeenCalledWith('customResult');

			i18n.unload();
		});
	});

	describe('handleLocaleChange', () => {
		test('should invoke updateLocale when the languagechange event fires', () => {
			const i18n = new I18n({sync: true});
			i18n.load();

			const updateLocaleSpy = jest.spyOn(i18n, 'updateLocale');

			window.dispatchEvent(new Event('languagechange'));

			expect(updateLocaleSpy).toHaveBeenCalled();

			i18n.unload();
		});
	});
});
