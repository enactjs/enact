import React from 'react';
import {shallow, mount} from 'enzyme';
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
		const spinner = shallow(
			<Spinner transparent>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.transparent);

		expect(actual).to.equal(expected);
	});

	it('should have centered class when centered prop equals true', function () {
		const spinner = shallow(
			<Spinner centered>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.centered);

		expect(actual).to.equal(expected);
	});

	it('should have content class when Spinner has children', function () {
		const spinner = shallow(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});

	it('should not have content class when Spinner has no children', function () {
		const spinner = shallow(
			<Spinner />
		);

		const expected = false;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});
});
