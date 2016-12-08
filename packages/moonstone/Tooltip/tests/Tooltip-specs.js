import React from 'react';
import {mount} from 'enzyme';
import {Tooltip} from '../Tooltip';

describe('should return the correct text in tooltip', () => {
	it('should render tooltip component', function () {
		const tooltip = mount(
			<Tooltip text='HELLO' />
		);

		const expected = 'HELLO';
		const actual = tooltip.text();

		expect(actual).to.equal(expected);
	});
});
