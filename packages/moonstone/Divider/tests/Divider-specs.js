import React from 'react';
import {shallow} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	it('should capitalize its content', function () {
		const content = 'uncapped';
		const divider = shallow(
			<Divider>{content}</Divider>
		);

		const expected = content.charAt(0).toUpperCase();
		const actual = divider.text().charAt(0);

		expect(actual).to.equal(expected);
	});
});

