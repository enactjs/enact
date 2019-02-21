import '../../src/glue.js';
import {isNonLatinLocale} from '../locale';

const validate = (expected) => (actual) => {
	expect(actual ? 'non-latin' : 'latin').toBe(expected);
};

describe('locale', () => {

	test('should treat "en-US" as latin locale', () => {
		isNonLatinLocale('en-US', {sync: true, onLoad: validate('latin')});
	});

	test('should treat "ja-JP" as non-latin locale', () => {
		isNonLatinLocale('ja-JP', {sync: true, onLoad: validate('non-latin')});
	});

	test('should treat "en-US" as non-latin locale with language override', () => {
		isNonLatinLocale('en-US', {
			sync: true,
			nonLatinLanguageOverrides: ['en'],
			onLoad: validate('non-latin')
		});
	});

	test('should treat "en-US" as non-latin locale with locale override', () => {
		isNonLatinLocale('en-US', {
			sync: true,
			nonLatinLanguageOverrides: ['en-US'],
			onLoad: validate('non-latin')
		});
	});

	test('should treat "ja-JP" as latin locale with language override', () => {
		isNonLatinLocale('ja-JP', {
			sync: true,
			latinLanguageOverrides: ['ja'],
			onLoad: validate('latin')
		});
	});

	test('should treat "ja-JP" as latin locale with locale override', () => {
		isNonLatinLocale('ja-JP', {
			sync: true,
			latinLanguageOverrides: ['ja-JP'],
			onLoad: validate('latin')
		});
	});

	test('should treat "en-US" as latin locale with irrelevant override', () => {
		isNonLatinLocale('en-US', {
			sync: true,
			latinLanguageOverrides: ['ja'],
			nonLatinLanguageOverrides: ['es-US'],
			onLoad: validate('latin')
		});
	});
});
