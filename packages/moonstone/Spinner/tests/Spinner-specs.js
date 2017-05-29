import React from 'react';
import {mount} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.less';

describe('Spinner Specs', () => {
	it('should have not have MarqueeText as a child when Spinner has no children', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = false;
		const actual = spinner.find('MarqueeText').exists();

		expect(actual).to.equal(expected);
	});

	it('should have MarqueeText as a child when Spinner has children', function () {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find('MarqueeText').exists();

		expect(actual).to.equal(expected);
	});

	it('should have transparent class when transparent prop equals true', function () {
		const spinner = mount(
			<Spinner transparent>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.transparent);

		expect(actual).to.equal(expected);
	});

	it('should have centered class when centered prop equals true', function () {
		const spinner = mount(
			<Spinner centered>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.centered);

		expect(actual).to.equal(expected);
	});

	it('should have content class when Spinner has children', function () {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});

	it('should not have content class when Spinner has no children', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = false;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});

	it('should set role to alert by default', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'alert';
		const actual = spinner.find(`div.${css.spinner}`).prop('role');

		expect(actual).to.equal(expected);
	});

	it('should set aria-live to off by default', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'off';
		const actual = spinner.find(`div.${css.spinner}`).prop('aria-live');

		expect(actual).to.equal(expected);
	});

	it('should have no scrim class when blockClickOn prop equals container', function () {
		const spinner = mount(
			<Spinner blockClickOn="container" />
		);

		const expected = false;
		const actual = spinner.find(`.${css.scrim}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have scrim class when blockClickOn prop equals container and when scrim prop equals true', function () {
		const spinner = mount(
			<Spinner blockClickOn="container" scrim />
		);

		const expected = true;
		const actual = spinner.find(`.${css.scrim}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have FloatingLayer when blockClickOn prop equals screen', function () {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);

		const spinner = mount(
			<Spinner blockClickOn="screen" />
		);

		const expected = true;
		const actual = spinner.find('FloatingLayer').exists();

		expect(actual).to.equal(expected);
	});
});
