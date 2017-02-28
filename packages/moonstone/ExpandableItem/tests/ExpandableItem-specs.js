import React from 'react';
import {mount} from 'enzyme';
import {ExpandableItemBase} from '../ExpandableItem';

describe('ExpandableItem', () => {
	it('should close when disabled', function () {
		const wrapped = mount(
			<ExpandableItemBase title="Item" open>
				<div>Hello</div>
			</ExpandableItemBase>
		);

		wrapped.setProps({disabled: true});

		const expected = false;
		const actual = wrapped.find('ExpandableContainer').prop('open');

		expect(actual).to.equal(expected);
	});
});
