import React from 'react';
import {mount} from 'enzyme';

import Heading from '../Heading';
import css from '../Heading.module.less';

describe('Heading Specs', () => {

	test('should render a Heading with content', () => {
		const content = 'Hello Heading!';

		const subject = mount(
			<Heading>{content}</Heading>
		);

		const expected = content;
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should apply a size class when defining a size', () => {
		const subject = mount(
			<Heading size="large">Heading Text</Heading>
		);

		const expected = css.large;
		const actual = subject.children().prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply a matching spacing class to its defined size', () => {
		const subject = mount(
			<Heading size="large">Heading Text</Heading>
		);

		const expected = css.largeSpacing;
		const actual = subject.children().prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply an alternate spacing class to its defined size if the two differ', () => {
		const subject = mount(
			<Heading size="large" spacing="small">Heading Text</Heading>
		);

		const expected = css.smallSpacing;
		const actual = subject.children().prop('className');

		expect(actual).toContain(expected);
	});
});
