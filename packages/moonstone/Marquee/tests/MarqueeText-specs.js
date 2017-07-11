import React from 'react';
import {mount} from 'enzyme';
import MarqueeText from '../MarqueeText';

import css from '../Marquee.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق';

describe('MarqueeText', () => {
	it('should determine the correct directionality of latin text on initial render', function () {
		const content = ltrText;

		const subject = mount(
			<MarqueeText>{content}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should determine the correct directionality of non-latin text on initial render', function () {
		const content = rtlText;

		const subject = mount(
			<MarqueeText>{content}</MarqueeText>
		);

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should force the directionality text if forceDirection is specified', function () {
		const content = rtlText;

		const subject = mount(
			<MarqueeText forceDirection="ltr">{content}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should switch directionality when the text content changes after initial render', function () {
		const contentBefore = ltrText;
		const contentAfter = rtlText;

		const subject = mount(
			<MarqueeText>{contentBefore}</MarqueeText>
		);

		subject.setProps({children: contentAfter});

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', function () {
		const contentBefore = ltrText;
		const contentAfter = rtlText;

		const subject = mount(
			<MarqueeText forceDirection="ltr">{contentBefore}</MarqueeText>
		);

		subject.setProps({children: contentAfter});

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
