import React from 'react';
import {mount} from 'enzyme';
import Header from '../Header';
import css from '../Header.module.less';

describe('Header Specs', () => {

	test('should render with title text upper-cased', () => {
		let msg = 'Upper-cased Header';

		const header = mount(
			<Header><title>{msg}</title></Header>
		);

		const expected = msg.toUpperCase();
		const actual = header.find('h1').text();

		expect(actual).toBe(expected);
	});

	test('should have fullBleed class applied', () => {
		const header = mount(
			<Header fullBleed>
				<title>Header</title>
			</Header>
		);

		const expected = true;
		const actual = header.find('header').hasClass(css.fullBleed);

		expect(actual).toBe(expected);
	});

	test('should inject a custom component when headerInput is used', () => {
		const Input = () => <input />;

		// This just uses an <input> tag for easy discoverability. It should behave the same way
		// as a moonstone/Input, the standard here, but that would require importing a diffenent
		// component than what we're testing here.
		const header = mount(
			<Header>
				<title>Header</title>
				<headerInput>
					<Input />
				</headerInput>
			</Header>
		);

		const expected = 1;
		const actual = header.find('input');

		expect(actual).toHaveLength(expected);
	});
});
