import React from 'react';
import {mount} from 'enzyme';
import Marquee from '../Marquee';

describe('Marquee Specs', () => {

	// Update this later to probably require 2 div tags.
	it('should render a single \<div\> tag', function () {
		const msg = 'Marquee Text';
		const button = mount(
			<Marquee>{msg}</Marquee>
		);

		const buttonTag = button.find('div');
		const expected = 1;
		const actual = buttonTag.length;

		expect(actual).to.equal(expected);
	});

});
