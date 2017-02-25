import React from 'react';
import {mount} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.less';

describe('Spinner Specs', () => {
	it('should have not have MarqueeText as a child when Spinner has no children', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = true;
		const actual = spinner.find('MarqueeText').isEmpty();

		expect(actual).to.equal(expected);
	});

	it('should have MarqueeText as a child when Spinner has children', function () {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = false;
		const actual = spinner.find('MarqueeText').isEmpty();

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

	it('should have no scrimTranslucent class when blockClick prop equals container', function () {
		const spinner = mount(
			<Spinner blockClick="container" />
		);

		const expected = true;
		const actual = spinner.find(`.${css.scrimTranslucent}`).isEmpty();

		expect(actual).to.equal(expected);
	});

	it('should have scrimTranslucent class when blockClick prop equals container and when scrim prop equals true', function () {
		const spinner = mount(
			<Spinner blockClick="container" scrim />
		);

		const expected = false;
		const actual = spinner.find(`.${css.scrimTranslucent}`).isEmpty();

		expect(actual).to.equal(expected);
	});

	it('should have FloatingLayer when blockClick prop equals screen', function () {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);

		const spinner = mount(
			<Spinner blockClick="screen" />
		);

		const expected = false;
		const actual = spinner.find('FloatingLayer').isEmpty();

		expect(actual).to.equal(expected);
	});
});
