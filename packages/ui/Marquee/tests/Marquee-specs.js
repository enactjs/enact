import React from 'react';
import {mount, shallow} from 'enzyme';
import {Marquee, MarqueeBase} from '../index.js';

import css from '../Marquee.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق',
	contentSelector = `.${css.text}`;

const makeI18nSubscriber = () => ({
	listener: null,
	subscribe: function (channel, listener) {
		if (channel === 'i18n') {
			this.listener = listener;
		}
	},
	unsubscribe: function () {
		this.listener = null;
	},
	publish: function (message) {
		if (this.listener) {
			this.listener({
				channel: 'i18n',
				message
			});
		}
	}
});

describe('Marquee', () => {
	it('should determine the correct directionality of latin text on initial render', function () {
		const subject = mount(
			<Marquee>{ltrText}</Marquee>
		);

		const expected = 'ltr';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should determine the correct directionality of non-latin text on initial render', function () {
		const subject = mount(
			<Marquee>{rtlText}</Marquee>
		);

		const expected = 'rtl';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should force the directionality text if forceDirection is specified', function () {
		const subject = mount(
			<Marquee forceDirection="ltr">{rtlText}</Marquee>
		);

		const expected = 'ltr';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should switch directionality when the text content changes after initial render', function () {
		const subject = mount(
			<Marquee>{ltrText}</Marquee>
		);

		subject.setProps({children: rtlText});
		subject.update();

		const expected = 'rtl';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', function () {
		const subject = mount(
			<Marquee forceDirection="ltr">{ltrText}</Marquee>
		);

		subject.setProps({children: rtlText});
		subject.update();

		const expected = 'ltr';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should override direction to RTL when forceDirection is set and locale is LTR', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<Marquee forceDirection="rtl" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: false});

		const expected = 'rtl';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should override direction to LTR when forceDirection is set and locale is RTL', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<Marquee forceDirection="ltr" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: true});

		const expected = 'ltr';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of RTL when forceDirection is RTL and locale is RTL', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<Marquee forceDirection="rtl" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: true});

		const expected = 'rtl';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of LTR when forceDirection is LTR and locale is LTR', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<Marquee forceDirection="ltr" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: false});

		const expected = 'ltr';
		const actual = subject.find(contentSelector).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});


describe('MarqueeBase', () => {

	// Computed Property Tests

	it('should not include the animate class when animating is false', function () {
		const subject = shallow(
			<MarqueeBase />
		);

		const expected = false;
		const actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);
	});

	it('should include the animate class when animating is true', function () {
		const subject = shallow(
			<MarqueeBase animating />
		);

		const expected = true;
		const actual = subject.childAt(0).hasClass(css.animate);
		expect(actual).to.equal(expected);
	});

	it('should not transition when animating is false', function () {
		const subject = shallow(
			<MarqueeBase />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.not.have.property('transition');
	});

	it('should transition when animating is true', function () {
		const subject = shallow(
			<MarqueeBase animating />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('transitionDuration');
	});

	it('should set RTL direction in LTR context when the text directionality is RTL', function () {
		const subject = shallow(
			<MarqueeBase rtl />,
			{context: {rtl: false}}
		);

		const expected = 'rtl';
		const actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);
	});

	it('should set LTR direction in RTL when the text directionality is LTR', function () {
		const subject = shallow(
			<MarqueeBase />,
			{context: {rtl: true}}
		);

		const expected = 'ltr';
		const actual = subject.childAt(0).prop('style').direction;
		expect(actual).to.equal(expected);
	});

	it('should transition from the right with LTR text', function () {
		const subject = shallow(
			<MarqueeBase animating distance={100} />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('right');
	});

	it('should transition from the left with RTL text', function () {
		const subject = shallow(
			<MarqueeBase animating distance={100} rtl />
		);

		const actual = subject.childAt(0).prop('style');
		expect(actual).to.have.property('left');
	});
});
