import React from 'react';
import {mount} from 'enzyme';
import MarqueeText from '../MarqueeText';

import css from '../Marquee.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق';

describe('MarqueeText', () => {
	it('should not set directionality of latin text on initial render without forceDirection', function () {
		const subject = mount(
			<MarqueeText>{ltrText}</MarqueeText>
		);

		const expected = null;
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should note set correct directionality of rtl text on initial render without forceDirection', function () {
		const subject = mount(
			<MarqueeText>{rtlText}</MarqueeText>
		);

		const expected = null;
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

	it('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', function () {
		const subject = mount(
			<MarqueeText forceDirection="ltr">{ltrText}</MarqueeText>
		);

		subject.setProps({children: rtlText});

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
