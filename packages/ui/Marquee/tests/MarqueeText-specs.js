import React from 'react';
import {mount} from 'enzyme';
import MarqueeText from '../MarqueeText';

import css from '../Marquee.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق';

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

describe('MarqueeText', () => {
	it('should determine the correct directionality of latin text on initial render', function () {
		const subject = mount(
			<MarqueeText>{ltrText}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should determine the correct directionality of non-latin text on initial render', function () {
		const subject = mount(
			<MarqueeText>{rtlText}</MarqueeText>
		);

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should force the directionality text if forceDirection is specified', function () {
		const subject = mount(
			<MarqueeText forceDirection="ltr">{rtlText}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should switch directionality when the text content changes after initial render', function () {
		const subject = mount(
			<MarqueeText>{ltrText}</MarqueeText>
		);

		subject.setProps({children: rtlText});

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', function () {
		const subject = mount(
			<MarqueeText forceDirection="ltr">{ltrText}</MarqueeText>
		);

		subject.setProps({children: rtlText});

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should override direction to RTL when forceDirection is set and locale is LTR', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<MarqueeText forceDirection="rtl" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: false});

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should override direction to LTR when forceDirection is set and locale is RTL', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<MarqueeText forceDirection="ltr" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: true});

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of RTL when forceDirection is RTL and locale is RTL', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<MarqueeText forceDirection="rtl" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: true});

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should have direction of LTR when forceDirection is LTR and locale is LTR', function () {
		const Subscriber = makeI18nSubscriber();
		const subject = mount(
			<MarqueeText forceDirection="ltr" />,
			{context: {Subscriber}}
		);

		Subscriber.publish({rtl: false});

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
