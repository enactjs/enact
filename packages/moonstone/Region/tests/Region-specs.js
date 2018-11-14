import Region from '../Region';

describe('Region', () => {
	describe('computed property', () => {
		describe('aria-label', () => {
			const ariaLabel = 'LABEL';
			const title = 'TITLE';

			test('should use aria-label when set', () => {
				const props = {
					'aria-label': ariaLabel,
					title: title
				};

				const expected = ariaLabel;
				const actual = Region.computed['aria-label'](props);

				expect(actual).toBe(expected);
			});

			test('should use title when aria-label is not set', () => {
				const props = {
					title: title
				};

				const expected = title;
				const actual = Region.computed['aria-label'](props);

				expect(actual).toBe(expected);
			});
		});
	});
});
