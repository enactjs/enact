import React from 'react';
import {mount} from 'enzyme';
import Heading from '../Heading';

describe('Heading Specs', () => {

	// Temporarily skipping until the theme-wide uppercase status can be officially determined.
	test.skip('should capitalize its content', () => {
		const content = 'uncapped';
		const heading = mount(
			<Heading>{content}</Heading>
		);

		const expected = content.charAt(0).toUpperCase();
		const actual = heading.text().charAt(0);

		expect(actual).toBe(expected);
	});

	test('should render a Heading with content', () => {
		const content = 'Hello Heading!';

		const heading = mount(
			<Heading>{content}</Heading>
		);

		const expected = content;
		const actual = heading.text();

		expect(actual).toBe(expected);
	});
});
