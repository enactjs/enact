import Region from '../Region';

describe('Region', () => {
	describe('computed property', () => {
		describe('aria-label', () => {
			const ariaLabel = 'LABEL';
			const title = 'TITLE';

			it('should use aria-label when set', function () {
				const props = {
					'aria-label': ariaLabel,
					title: title
				};

				const expected = ariaLabel;
				const actual = Region.computed['aria-label'](props);

				expect(actual).to.equal(expected);
			});

			it('should use title when aria-label is not set', function () {
				const props = {
					title: title
				};

				const expected = title;
				const actual = Region.computed['aria-label'](props);

				expect(actual).to.equal(expected);
			});
		});
	});
});
