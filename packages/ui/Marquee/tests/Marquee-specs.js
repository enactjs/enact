import React from 'react';
import {mount, shallow} from 'enzyme';
import {Marquee, MarqueeBase} from '../index.js';

import css from '../Marquee.module.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق',
	contentSelector = `.${css.text}`;

describe('Marquee', () => {
	beforeEach(() => {
		global.Element.prototype.getBoundingClientRect = jest.fn(() => {
			return {
				width: 100,
				height: 50,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			};
		});
	});

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

	test(
		'should convert percentage values of marqueeSpacing to absolute values',
		(done) => {
			const subject = mount(
				<Marquee marqueeSpacing="60%" marqueeOn="render" marqueeOnRenderDelay={10} />
			);

			setTimeout(() => {
				subject.update();

				const expected = 60;
				const actual = subject.find(MarqueeBase).prop('spacing');

				expect(actual).toBe(expected);
				done();
			}, 100);
		}
	);

	test(
		'should pass absolute values of marqueeSpacing',
		(done) => {
			const subject = mount(
				<Marquee marqueeSpacing={80} marqueeOn="render" marqueeOnRenderDelay={10} />
			);

			setTimeout(() => {
				subject.update();

				const expected = 80;
				const actual = subject.find(MarqueeBase).prop('spacing');

				expect(actual).toBe(expected);
				done();
			}, 100);
		}
	);

	test(
		'should creates and observes with ResizeObserver',
		() => {
			const observe = jest.fn();
			global.ResizeObserver = jest.fn(() => ({
				observe,
				disconnect: jest.fn()
			}));

			mount(<Marquee>{ltrText}</Marquee>);

			expect(global.ResizeObserver).toHaveBeenCalled();
			expect(observe).toHaveBeenCalled();
		});
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

	test('should transition from the right with LTR text (a negative translate value)', () => {
		const subject = shallow(
			<MarqueeBase animating distance={100} />
		);

		const actual = subject.childAt(0).prop('style').transform;
		expect(actual).toContain('-');
	});

	test('should transition from the left with RTL text (a positive translate value)', () => {
		const subject = shallow(
			<MarqueeBase animating distance={100} rtl />
		);

		const actual = subject.childAt(0).prop('style').transform;
		expect(actual).not.toContain('-');
	});

	test('should duplicate from content when promoted and a non-zero distance', () => {
		const subject = shallow(
			<MarqueeBase willAnimate distance={100}>
				Text
			</MarqueeBase>
		);

		const actual = subject.text();
		expect(actual).toBe('TextText');
	});

	test('should not duplicate from content when promoted and a zero distance', () => {
		const subject = shallow(
			<MarqueeBase willAnimate distance={0}>
				Text
			</MarqueeBase>
		);

		const actual = subject.text();
		expect(actual).toBe('Text');
	});

	test('should not duplicate from content when not promoted and a non-zero distance', () => {
		const subject = shallow(
			<MarqueeBase distance={100}>
				Text
			</MarqueeBase>
		);

		const actual = subject.text();
		expect(actual).toBe('Text');
	});

	test('should add aria-label with content when promoted and a non-zero distance', () => {
		const text = 'Text';
		const subject = mount(
			<MarqueeBase willAnimate distance={100}>
				{text}
			</MarqueeBase>
		);

		const expected = text;
		const actual = subject.childAt(0).prop('aria-label');
		expect(actual).toBe(expected);
	});

	test('should not override aria-label with content when promoted and a non-zero distance', () => {
		const aria = 'Custom';
		const subject = mount(
			<MarqueeBase willAnimate distance={100} aria-label={aria}>
				Text
			</MarqueeBase>
		);

		const expected = aria;
		const actual = subject.childAt(0).prop('aria-label');
		expect(actual).toBe(expected);
	});

	test('should concatenate string children when promoted and a non-zero distance', () => {
		const subject = mount(
			<MarqueeBase willAnimate distance={100}>
				This is {'A'} test
			</MarqueeBase>
		);

		const expected = 'This is  A  test';
		const actual = subject.childAt(0).prop('aria-label');
		expect(actual).toBe(expected);
	});

	test('should not concatenate non-string children when promoted and a non-zero distance', () => {
		const subject = mount(
			<MarqueeBase willAnimate distance={100}>
				Test
				<div>Hello</div>
				World
			</MarqueeBase>
		);

		const expected = 'Test World';
		const actual = subject.childAt(0).prop('aria-label');
		expect(actual).toBe(expected);
	});

	test('should not throw exception for null children when promoted and a non-zero distance - ENYO-6362', () => {
		const mountSubject = () => mount(
			<MarqueeBase willAnimate distance={100}>
				{null}
			</MarqueeBase>
		);

		expect(mountSubject).not.toThrow();
	});
});
