import React from 'react';
import {mount, shallow} from 'enzyme';
import {Tooltip} from '../Tooltip';

describe('should return the correct text in tooltip', () => {
	it('should render button tag', function () {
		const tooltip = mount(
			<Tooltip
	        	tooltip='HELLO'
	        	showing={true}
	        >
	        </Tooltip>
		);

		const expected = 'HELLO';
		const actual = tooltip.text();

		expect(actual).to.equal(expected);
	});
});
