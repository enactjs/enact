import React from 'react';
import {mount} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	it('should render a Divider with content', function () {
		let msg = 'Hello Divider!';

		const divider = mount(
			<Divider>{msg}</Divider>
		);

		const expected = msg;
		const actual = divider.text();

		expect(actual).to.equal(expected);
	});
});
