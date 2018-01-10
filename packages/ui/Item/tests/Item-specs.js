import React from 'react';
import {mount} from 'enzyme';
import {ItemBase} from '../Item';

describe('Item', () => {

	it('should create an Item that is enabled by default', function () {
		const item = mount(
			<ItemBase>I am an Item</ItemBase>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

});
