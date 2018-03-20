import React from 'react';
import {mount, shallow} from 'enzyme';
import BodyText from '../BodyText';
import css from '../BodyText.less';

describe('BodyText Specs', () => {

	it('should render a single <p> tag', function () {
		const msg = 'Hello BodyText!';
		const bodyText = mount(
			<BodyText>{msg}</BodyText>
		);

		const bodyTextTag = bodyText.find('p');
		const expected = 1;
		const actual = bodyTextTag.length;

		expect(actual).to.equal(expected);
	});

	it('should render BodyText with content', function () {
		const content = 'Hello BodyText!';

		const bodyTextTag = mount(
			<BodyText>{content}</BodyText>
		);

		const expected = content;
		const actual = bodyTextTag.text();

		expect(actual).to.equal(expected);
	});

	it('should not include the centered class by default', function () {
		const subject = shallow(
			<BodyText />
		);

		const expected = false;
		const actual = subject.hasClass(css.centered);
		expect(actual).to.equal(expected);
	});

	it('should include the centered class if `centered` is true', function () {
		const subject = shallow(
			<BodyText centered />
		);

		const expected = true;
		const actual = subject.hasClass(css.centered);
		expect(actual).to.equal(expected);
	});
});
