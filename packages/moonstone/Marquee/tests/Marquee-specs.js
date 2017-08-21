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
		expect(actual).to.have.property('transition');
	});

	it('should have negative translate for LTR text', function () {
		const subject = shallow(
			<Marquee animating distance={100} />
		);

		// Testing for a negative number after transform3d(
		const expected = true;
		const actual = subject.childAt(0).prop('style').transform.indexOf('-') >= 0;
		expect(actual).to.equal(expected);
	});

	it('should have positive translate for RTL text', function () {
		const subject = shallow(
			<Marquee animating distance={100} rtl />
		);

		// Testing for a positive number after transform3d(
		const expected = true;
		const actual = subject.childAt(0).prop('style').transform.indexOf('-') === -1;
		expect(actual).to.equal(expected);
	});

	it('should override RTL when forceRtl is true', function () {
		const subject = shallow(
			<Marquee forceDirection="rtl" />
		);

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should override direction when forceDirection is ltr and locale is RTL', function () {
		const subject = shallow(
			<Marquee forceDirection="ltr" />,
			{context: {rtl: true}}
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of rtl when forceDirection is rtl and context.rtl is true', function () {
		const subject = shallow(
			<Marquee forceDirection="rtl" />,
			{context: {rtl: true}}
		);

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of ltr when forceDirection is ltr and context.rtl is false', function () {
		const subject = shallow(
			<Marquee forceDirection="ltr" />,
			{context: {rtl: false}}
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of null when forceDirection is null, and content and context are LTR', function () {
		const subject = shallow(
			<Marquee />,
			{context: {rtl: false}}
		);

		const expected = null;
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of null when forceDirection is null, and content and context are RTL', function () {
		const subject = shallow(
			<Marquee rtl />,
			{context: {rtl: true}}
		);

		const expected = null;
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
