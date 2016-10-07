import React from 'react';
import {mount} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	it('should render a Divider with content', function () {
		const content = 'Hello Divider!';

		const divider = mount(
			<Divider>{content}</Divider>
		);

		const expected = content;
		const actual = divider.text();

		expect(actual).to.equal(expected);
	});
});
