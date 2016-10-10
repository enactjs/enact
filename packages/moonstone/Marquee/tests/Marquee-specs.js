import React from 'react';
import {shallow} from 'enzyme';
import Marquee from '../Marquee';

import css from '../Marquee.less';

describe('Marquee', () => {

	const rtlContent = 'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.';
	const content = 'The bean bird flies at sundown.';

	// Computed Property Tests

	it('should include the animate class only when animating is true', function () {
		const subject = shallow(
			<Marquee />
		);

		let expected = false;
		let actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);

		subject.setProps({animating: true});

		expected = true;
		actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);
	});

	it('should transition only when animating is true', function () {
		const subject = shallow(
			<Marquee />
		);

		let actual = subject.childAt(0).prop('style');
		expect(actual).to.not.have.property('transition');

		subject.setProps({animating: true});

		actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('transition');
	});

	it('should set the direction when the text directionality differs from context RTL', function () {
		const subject = shallow(
			<Marquee>
				{rtlContent}
			</Marquee>,
			{context: {rtl: false}}
		);

		let expected = 'rtl';
		let actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);

		// Test LTR content and RTL context
		subject.setContext({rtl: true});
		subject.setProps({children: content});

		expected = 'ltr';
		actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);
	});

	it('should adjust the transition direction for RTL', function () {
		const subject = shallow(
			<Marquee animating distance={100}>
				{content}
			</Marquee>
		);

		// Testing for a negative number after transform3d(
		let expected = '-';
		let actual = subject.childAt(0).prop('style').transform.charAt(12);
		expect(actual).to.equal(expected);

		// Test RTL content
		subject.setProps({children: rtlContent});

		expected = '1';
		actual = subject.childAt(0).prop('style').transform.charAt(12);
		expect(actual).to.equal(expected);
	});
});
