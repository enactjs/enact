import React from 'react';
import {mount} from 'enzyme';
import Header from '../Header';
import css from '../Header.less';

describe('Header Specs', () => {

	it('should render with title text upper-cased', function () {
		let msg = 'Upper-cased Header';

		const header = mount(
			<Header><title>{msg}</title></Header>
		);

		const expected = msg.toUpperCase();
		const actual = header.find('h1').text();

		expect(actual).to.equal(expected);
	});

	it('should have fullBleed class applied', function () {
		const header = mount(
			<Header fullBleed>
				<title>Header</title>
			</Header>
		);

		const expected = true;
		const actual = header.find('header').hasClass(css.fullBleed);

		expect(actual).to.equal(expected);
	});

	it('should inject a custom component when headerInput is used', function () {
		// This just uses an <input> tag for easy discoverability. It should behave the same way
		// as a moonstone/Input, the standard here, but that would require importing a diffenent
		// component than what we're testing here.
		const header = mount(
			<Header>
				<title>Header</title>
				<headerInput>
					<input placeholder="An easy to find legal DOM node" />
				</headerInput>
			</Header>
		);

		const expected = 1;
		const actual = header.find('input');

		expect(actual).to.have.length(expected);
	});
});
