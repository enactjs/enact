import css from '../css';

describe('css feature', () => {
	const componentCss = {
		button: 'component-button',
		inner: 'component-inner'
	};

	it('should merge component and author css objects and ignore author css that does not exist in the component css', function () {
		const authorCss = {
			other: 'author-other'
		};
		const updated = css(componentCss, authorCss);

		const expected = ['button', 'inner'];
		const actual = Object.keys(updated);

		expect(actual).to.deep.equal(expected);
	});

	it('should join class names that exist in both component and author css objects', function () {
		const authorCss = {
			button: 'author-button'
		};
		const updated = css(componentCss, authorCss);

		const expected = componentCss.button + ' author-button';
		const actual = updated.button;

		expect(actual).to.equal(expected);
	});

});
