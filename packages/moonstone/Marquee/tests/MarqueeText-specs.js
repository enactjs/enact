import React from 'react';
import {mount} from 'enzyme';
import MarqueeText from '../MarqueeText';

import css from '../Marquee.less';

describe('MarqueeText', () => {
	it('should determine the correct directionality of latin text on initial render', function () {
		const content = 'This is some fine latin text.';

		const subject = mount(
			<MarqueeText>{content}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should determine the correct directionality of non-latin text on initial render', function () {
		const content = 'العربية - العراق';

		const subject = mount(
			<MarqueeText>{content}</MarqueeText>
		);

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should force the directionality text if forceDirection is specified', function () {
		const content = 'العربية - العراق';

		const subject = mount(
			<MarqueeText forceDirection="ltr">{content}</MarqueeText>
		);

		const expected = 'ltr';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});

	it('should switch directionality when the text content changes after initial render', function () {
		const contentBefore = 'This is some fine latin text.';
		const contentAfter = 'العربية - العراق';

		const subject = mount(
			<MarqueeText>{contentBefore}</MarqueeText>
		);

		subject.setProps({children: contentAfter});

		const expected = 'rtl';
		const actual = subject.find(`.${css.text}`).prop('style');

		expect(actual).to.have.property('direction').to.equal(expected);
	});
});
