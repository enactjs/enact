import React from 'react';
import {mount} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	it('should render a Divider with content', function () {
		const expected = 'Hello Divider!';

		const divider = mount(
			<Divider>{expected}</Divider>
		);

		const actual = divider.text();

		expect(actual).to.equal(expected);
	});
});
