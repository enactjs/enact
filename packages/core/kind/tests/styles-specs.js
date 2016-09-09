/* globals describe, it, expect */

import styles from '../styles';

describe('styles', () => {

	const css = {
		button: 'unambiguous-button-class-name',
		client: 'unambiguous-button-class-name-client'
	};

	// className tests

	it('Should add cfg.className to props', function () {
		const cfg = {
			className: 'button'
		};

		const updated = styles(cfg, {});

		const expected = cfg.className;
		const actual = updated.className;

		expect(actual).to.equal(expected);
	});

	it('Should resolve cfg.className to the cfg.css map', function () {
		const cfg = {
			css,
			className: 'button'
		};

		const updated = styles(cfg, {});

		const expected = css.button;
		const actual = updated.className;

		expect(actual).to.equal(expected);
	});

	it('Should pass through props.className when cfg.className absent', function () {
		const props = {
			className: 'button'
		};
		const updated = styles({}, props);

		const expected = props.className;
		const actual = updated.className;

		expect(actual).to.equal(expected);
	});

	it('Should append cfg.className with props.className', function () {
		const props = {
			className: 'custom-button'
		};
		const cfg = {
			className: 'button'
		};

		const updated = styles(cfg, props);

		const expected = props.className;
		const actual = updated.className;

		expect(actual).to.equal(expected);
	});

	it('Should resolve cfg.className and append with props.className', function () {
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

		expect(actual).to.equal(expected);
	});

	// style tests

	it('Should add cfg.style to props', function () {
		const cfg = {
			style: {
				color: 'green'
			}
		};

		const updated = styles(cfg, {});

		const expected = cfg.style.color;
		const actual = updated.style.color;

		expect(actual).to.equal(expected);
	});

	it('Should pass through props.style when cfg.style absent', function () {
		const props = {
			style: {
				color: 'green'
			}
		};
		const updated = styles({}, props);

		const expected = props.style.color;
		const actual = updated.style.color;

		expect(actual).to.equal(expected);
	});

	it('Should merge cfg.style and props.style', function () {
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

		expect(actual).to.equal(expected);
	});

	// Doesn't support merging shorthand properties and individual properties
	// e.g. borderWidth: 3px + border: 1px solid black = border: 3px solid black
	it('Should not merge shorthand properties', function () {
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

		expect(actual).to.not.equal(expected);
	});

	// styler tests

	it('Should add styler.join() to props', function () {
		const updated = styles({}, {});

		const expected = 'function';
		const actual = typeof updated.styler.join;

		expect(actual).to.equal(expected);
	});

	it('Should join classes together with a space', function () {
		const updated = styles({}, {});

		const expected = 'abc def';
		const actual = updated.styler.join('abc', 'def');

		expect(actual).to.equal(expected);
	});

	it('Should resolve join classes to css map', function () {
		const updated = styles({css}, {});

		const expected = css.button + ' ' + css.client;
		const actual = updated.styler.join('button', 'client');

		expect(actual).to.equal(expected);
	});

	it('Should not resolve author classes to css map', function () {
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

		expect(actual).to.equal(expected);
	});

	it('Should append resolved class names to props.className', function () {
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

		expect(actual).to.equal(expected);
	});
});
