import React from 'react';
import {mount, shallow} from 'enzyme';
import BodyText from '../BodyText';
import {Cell} from '../../Layout';
import css from '../BodyText.module.less';

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

	test('should support changing the component element to a different DOM node', () => {
		const componentTag = 'address';
		const subject = shallow(
			<BodyText component={componentTag} />
		);

		const expected = componentTag;
		const actual = subject.getElement().type;
		expect(actual).toBe(expected);
	});

	test('should support changing the component element to a functional component', () => {
		const component = Cell;
		const subject = shallow(
			<BodyText component={component} />
		);

		const expected = component;
		const actual = subject.getElement().type;
		expect(actual).toBe(expected);
	});
});
