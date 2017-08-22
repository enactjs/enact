import React from 'react';
import {mount} from 'enzyme';
import MarqueeText from '../MarqueeText';

// import css from '../Marquee.less';
import uiCss from '@enact/ui/Marquee/Marquee.less';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق';

describe('MarqueeText', () => {
	it('should determine the correct directionality of latin text on initial render', function () {
		const subject = mount(
			<MarqueeText>{ltrText}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${uiCss.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should determine the correct directionality of non-latin text on initial render', function () {
		const subject = mount(
			<MarqueeText>{rtlText}</MarqueeText>
		);

		const expected = 'rtl';
		const actual = subject.find(`.${uiCss.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should force the directionality text if forceDirection is specified', function () {
		const subject = mount(
			<MarqueeText forceDirection="ltr">{rtlText}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${uiCss.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should switch directionality when the text content changes after initial render', function () {
		const subject = mount(
			<MarqueeText>{ltrText}</MarqueeText>
		);

		subject.setProps({children: rtlText});

		const expected = 'rtl';
		const actual = subject.find(`.${uiCss.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', function () {
		const subject = mount(
			<MarqueeText forceDirection="ltr">{ltrText}</MarqueeText>
		);

		subject.setProps({children: rtlText});

		const expected = 'ltr';
		const actual = subject.find(`.${uiCss.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
