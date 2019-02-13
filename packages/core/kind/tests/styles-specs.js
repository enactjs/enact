import styles from '../styles';

describe('styles', () => {

	const css = {
		button: 'unambiguous-button-class-name',
		client: 'unambiguous-button-class-name-client'
	};

	// className tests

	test('should add cfg.className to props', () => {
		const cfg = {
			className: 'button'
		};

		const updated = styles(cfg, {});

		const expected = cfg.className;
		const actual = updated.className;

		expect(actual).toBe(expected);
	});

	test('should resolve cfg.className to the cfg.css map', () => {
		const cfg = {
			css,
			className: 'button'
		};

		const updated = styles(cfg, {});

		const expected = css.button;
		const actual = updated.className;

		expect(actual).toBe(expected);
	});

	test(
		'should pass through props.className when cfg.className absent',
		() => {
			const props = {
				className: 'button'
			};
			const updated = styles({}, props);

			const expected = props.className;
			const actual = updated.className;

			expect(actual).toBe(expected);
		}
	);

	test('should append cfg.className with props.className', () => {
		const props = {
			className: 'custom-button'
		};
		const cfg = {
			className: 'button'
		};

		const updated = styles(cfg, props);

		const expected = props.className;
		const actual = updated.className;

		expect(actual).toBe(expected);
	});

	test(
		'should resolve cfg.className and append with props.className',
		() => {
			const props = {
				className: 'custom-button'
			};
			const cfg = {
				css,
				className: 'button'
			};

			const updated = styles(cfg, props);

			const expected = props.className;
			const actual = updated.className;

			expect(actual).toBe(expected);
		}
	);

	// style tests

	test('should add cfg.style to props', () => {
		const cfg = {
			style: {
				color: 'green'
			}
		};

		const updated = styles(cfg, {});

		const expected = cfg.style.color;
		const actual = updated.style.color;

		expect(actual).toBe(expected);
	});

	test('should pass through props.style when cfg.style absent', () => {
		const props = {
			style: {
				color: 'green'
			}
		};
		const updated = styles({}, props);

		const expected = props.style.color;
		const actual = updated.style.color;

		expect(actual).toBe(expected);
	});

	test('should merge cfg.style and props.style', () => {
		const props = {
			style: {
				color: 'green'
			}
		};
		const cfg = {
			style: {
				border: '1px solid black'
			}
		};

		const updated = styles(cfg, props);

		const expected = 2;
		const actual = Object.keys(updated.style).length;

		expect(actual).toBe(expected);
	});

	// Doesn't support merging shorthand properties and individual properties
	// e.g. borderWidth: 3px + border: 1px solid black = border: 3px solid black
	test('should not merge shorthand properties', () => {
		const props = {
			style: {
				borderWidth: '3px'
			}
		};
		const cfg = {
			style: {
				border: '1px solid black'
			}
		};

		const updated = styles(cfg, props);

		const expected = 1;
		const actual = Object.keys(updated.style).length;

		expect(actual).not.toBe(expected);
	});

	// styler tests

	test('should add styler.join() to props', () => {
		const updated = styles({}, {});

		const expected = 'function';
		const actual = typeof updated.styler.join;

		expect(actual).toBe(expected);
	});

	test('should join classes together with a space', () => {
		const updated = styles({}, {});

		const expected = 'abc def';
		const actual = updated.styler.join('abc', 'def');

		expect(actual).toBe(expected);
	});

	test('should resolve join classes to css map', () => {
		const updated = styles({css}, {});

		const expected = css.button + ' ' + css.client;
		const actual = updated.styler.join('button', 'client');

		expect(actual).toBe(expected);
	});

	test('should not resolve author classes to css map', () => {
		const cfg = {
			css,
			className: 'button'
		};
		const props = {
			className: 'button'
		};
		const updated = styles(cfg, props);

		const expected = css.button + ' button';
		const actual = updated.className;

		expect(actual).toBe(expected);
	});

	test('should append resolved class names to props.className', () => {
		const cfg = {
			css,
			className: 'button'
		};
		const props = {
			className: 'button'
		};
		const updated = styles(cfg, props);

		const expected = css.button + ' button ' + css.client;
		const actual = updated.styler.append('client');

		expect(actual).toBe(expected);
	});
});
