import React from 'react';
import {mount} from 'enzyme';
import Header from '../Header';

describe('Header Specs', () => {

	it('should render with title text upper-cased', function () {
		let msg = 'Upper-cased Header';

		const header = mount(
			<Header><title>{msg}</title></Header>
		);

		const expected = msg.toUpperCase();
		const actual = header.text();

		expect(actual).to.equal(expected);
	});

});
