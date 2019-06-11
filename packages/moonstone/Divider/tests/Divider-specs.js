import React from 'react';
import {mount} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	test('should capitalize its content', () => {
		const content = 'uncapped';
		const divider = mount(
			<Divider>{content}</Divider>
		);

		const expected = content.charAt(0).toUpperCase();
		const actual = divider.text().charAt(0);

		expect(actual).toBe(expected);
	});

	test('should render a Divider with content', () => {
		const content = 'Hello Divider!';

		const divider = mount(
			<Divider>{content}</Divider>
		);

		const expected = content;
		const actual = divider.text();

		expect(actual).toBe(expected);
	});
});
