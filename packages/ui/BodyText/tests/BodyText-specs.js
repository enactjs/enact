import React from 'react';
import {mount, shallow} from 'enzyme';
import BodyText from '../BodyText';
import css from '../BodyText.less';

describe('BodyText Specs', () => {

	test('should render a single <p> tag', () => {
		const msg = 'Hello BodyText!';
		const bodyText = mount(
			<BodyText>{msg}</BodyText>
		);

		const bodyTextTag = bodyText.find('p');
		const expected = 1;
		const actual = bodyTextTag.length;

		expect(actual).toBe(expected);
	});

	test('should render BodyText with content', () => {
		const content = 'Hello BodyText!';

		const bodyTextTag = mount(
			<BodyText>{content}</BodyText>
		);

		const expected = content;
		const actual = bodyTextTag.text();

		expect(actual).toBe(expected);
	});

	test('should not include the centered class by default', () => {
		const subject = shallow(
			<BodyText />
		);

		const expected = false;
		const actual = subject.hasClass(css.centered);
		expect(actual).toBe(expected);
	});

	test('should include the centered class if `centered` is true', () => {
		const subject = shallow(
			<BodyText centered />
		);

		const expected = true;
		const actual = subject.hasClass(css.centered);
		expect(actual).toBe(expected);
	});
});
