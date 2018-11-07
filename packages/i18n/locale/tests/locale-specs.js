import '../../src/glue.js';
import {isNonLatinLocale, updateLocale} from '../locale';

describe('locale', () => {

	it('should treat "en-US" as latin locale', (done) => {
		function onLoad (nonLatin) { done(nonLatin); }

		isNonLatinLocale('en-US', {sync: true, onLoad});
	});

	it('should treat "ja-JP" as non-latin locale', (done) => {
		function onLoad (nonLatin) { done(!nonLatin); }

		updateLocale('ja-JP');

		// eslint-disable-next-line no-undefined
		isNonLatinLocale(undefined, {sync: true, onLoad});
	});

	it('should treat "en-US" as non-latin locale with language override', (done) => {
		function onLoad (nonLatin) { done(!nonLatin); }

		isNonLatinLocale('en-US', {
			sync: true,
			nonLatinLanguageOverrides: ['en'],
			onLoad
		});
	});

	it('should treat "en-US" as non-latin locale with locale override', (done) => {
		function onLoad (nonLatin) { done(!nonLatin); }

		isNonLatinLocale('en-US', {
			sync: true,
			nonLatinLanguageOverrides: ['en-US'],
			onLoad
		});
	});

	it('should treat "ja-JP" as latin locale with language override', (done) => {
		function onLoad (nonLatin) { done(nonLatin); }

		isNonLatinLocale('ja-JP', {
			sync: true,
			latinLanguageOverrides: ['ja'],
			onLoad
		});
	});

	it('should treat "ja-JP" as latin locale with locale override', (done) => {
		function onLoad (nonLatin) { done(nonLatin); }

		isNonLatinLocale('ja-JP', {
			sync: true,
			latinLanguageOverrides: ['ja-JP'],
			onLoad
		});
	});

	it('should treat "en-US" as latin locale with irrelevant override', (done) => {
		function onLoad (nonLatin) { done(nonLatin); }

		isNonLatinLocale('en-US', {
			sync: true,
			latinLanguageOverrides: ['ja'],
			nonLatinLanguageOverrides: ['es-US'],
			onLoad
		});
	});
});
