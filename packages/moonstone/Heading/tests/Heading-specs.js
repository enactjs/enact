import React from 'react';
import {mount} from 'enzyme';
import Heading from '../Heading';

describe('Heading Specs', () => {

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
