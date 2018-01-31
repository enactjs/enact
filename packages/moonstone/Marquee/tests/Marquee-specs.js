import React from 'react';
import {shallow} from 'enzyme';
import Marquee from '../Marquee';

import css from '../Marquee.less';

describe('Marquee', () => {

	// Computed Property Tests

	it('should not include the animate class when animating is false', function () {
		const subject = shallow(
			<Marquee />
		);

		const expected = false;
		const actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);
	});

	it('should include the animate class when animating is true', function () {
		const subject = shallow(
			<Marquee animating />
		);

		const expected = true;
		const actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);
	});

	it('should not transition when animating is false', function () {
		const subject = shallow(
			<Marquee />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.not.have.property('transition');
	});

	it('should transition when animating is true', function () {
		const subject = shallow(
			<Marquee animating />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('transitionDuration');
	});

	it('should set RTL direction in LTR context when the text directionality is RTL', function () {
		const subject = shallow(
			<Marquee rtl />,
			{context: {rtl: false}}
		);

		const expected = 'rtl';
		const actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);
	});

	it('should set LTR direction in RTL when the text directionality is LTR', function () {
		const subject = shallow(
			<Marquee />,
			{context: {rtl: true}}
		);

		const expected = 'ltr';
		const actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);
	});

	it('should transition from the right with LTR text', function () {
		const subject = shallow(
			<Marquee animating distance={100} />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('right');
	});

	it('should transition from the left with RTL text', function () {
		const subject = shallow(
			<Marquee animating distance={100} rtl />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('left');
	});
});
