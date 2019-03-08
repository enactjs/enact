import React from 'react';
import {mount, shallow} from 'enzyme';
import {Marquee, MarqueeBase} from '../index.js';

import css from '../Marquee.module.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق',
	contentSelector = `.${css.text}`;

describe('Marquee', () => {
	test(
		'should determine the correct directionality of latin text on initial render',
		() => {
			const subject = mount(
				<Marquee>{ltrText}</Marquee>
			);

			const expected = 'ltr';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should determine the correct directionality of non-latin text on initial render',
		() => {
			const subject = mount(
				<Marquee>{rtlText}</Marquee>
			);

			const expected = 'rtl';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should force the directionality text if forceDirection is specified',
		() => {
			const subject = mount(
				<Marquee forceDirection="ltr">{rtlText}</Marquee>
			);

			const expected = 'ltr';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should switch directionality when the text content changes after initial render',
		() => {
			const subject = mount(
				<Marquee>{ltrText}</Marquee>
			);

			subject.setProps({children: rtlText});
			subject.update();

			const expected = 'rtl';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should not switch directionality when the text content changes after initial render and the forceDirection property was already set',
		() => {
			const subject = mount(
				<Marquee forceDirection="ltr">{ltrText}</Marquee>
			);

			subject.setProps({children: rtlText});
			subject.update();

			const expected = 'ltr';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should override direction to RTL when forceDirection is set and locale is LTR',
		() => {
			const subject = mount(
				<Marquee forceDirection="rtl" locale="ltr" />
			);

			const expected = 'rtl';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should override direction to LTR when forceDirection is set and locale is RTL',
		() => {
			const subject = mount(
				<Marquee forceDirection="ltr" locale="rtl" />
			);

			const expected = 'ltr';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should have direction of RTL when forceDirection is RTL and locale is RTL',
		() => {
			const subject = mount(
				<Marquee forceDirection="rtl" locale="rtl" />
			);

			const expected = 'rtl';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);

	test(
		'should have direction of LTR when forceDirection is LTR and locale is LTR',
		() => {
			const subject = mount(
				<Marquee forceDirection="ltr" locale="ltr" />
			);

			const expected = 'ltr';
			const actual = subject.find(contentSelector).prop('style');

			expect(actual).toHaveProperty('direction', expected);
		}
	);
});


describe('MarqueeBase', () => {

	// Computed Property Tests

	test(
		'should not include the animate class when animating is false',
		() => {
			const subject = shallow(
				<MarqueeBase />
			);

			const expected = false;
			const actual = subject.childAt(0).hasClass(css.animate);
			expect(actual).toBe(expected);
		}
	);

	test('should include the animate class when animating is true', () => {
		const subject = shallow(
			<MarqueeBase animating />
		);

		const expected = true;
		const actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).toBe(expected);
	});

	test('should not transition when animating is false', () => {
		const subject = shallow(
			<MarqueeBase />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).not.toHaveProperty('transition');
	});

	test('should transition when animating is true', () => {
		const subject = shallow(
			<MarqueeBase animating />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).toHaveProperty('transitionDuration');
	});

	test(
		'should set RTL direction in LTR context when the text directionality is RTL',
		() => {
			const subject = shallow(
				<MarqueeBase rtl />,
				{context: {rtl: false}}
			);

			const expected = 'rtl';
			const actual = subject.childAt(0).prop('style').direction;
			expect(actual).toBe(expected);
		}
	);

	test(
		'should set LTR direction in RTL when the text directionality is LTR',
		() => {
			const subject = shallow(
				<MarqueeBase />,
				{context: {rtl: true}}
			);

			const expected = 'ltr';
			const actual = subject.childAt(0).prop('style').direction;
			expect(actual).toBe(expected);
		}
	);

	test('should transition from the right with LTR text', () => {
		const subject = shallow(
			<MarqueeBase animating distance={100} />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).toHaveProperty('right');
	});

	test('should transition from the left with RTL text', () => {
		const subject = shallow(
			<MarqueeBase animating distance={100} rtl />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).toHaveProperty('left');
	});
});
