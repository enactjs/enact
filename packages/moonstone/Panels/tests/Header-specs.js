import React from 'react';
import {mount} from 'enzyme';
import Header from '../Header';

describe('Header Specs', () => {

	it('should render a single \<header\> tag', function () {
		const msg = 'Sweet Header!';
		const header = mount(
			<Header>{msg}</Header>
		);

		const headerTag = header.find('header');
		const expected = 1;
		const actual = headerTag.length;

		expect(actual).to.equal(expected);
	});

	it('should render with title text upper-cased', function () {
		let msg = 'Upper-cased Header';

		const header = mount(
			<Header>{msg}</Header>
		);

		const expected = msg.toUpperCase();
		const actual = header.text();

		expect(actual).to.equal(expected);
	});

});
