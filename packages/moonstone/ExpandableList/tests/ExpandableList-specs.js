import React from 'react';
import {mount} from 'enzyme';
import {ExpandableListBase} from '../ExpandableList';

describe('ExpandableList', () => {
	describe('#aria-multiselectable', () => {
		it('should be true when select is multiple', function () {
			const expandableList = mount(
				<ExpandableListBase title="Item" select="multiple">
					{['option1', 'option2', 'option3']}
				</ExpandableListBase>
			);

			const expected = true;
			const actual = expandableList.find('ExpandableItem').prop('aria-multiselectable');
			expect(actual).to.equal(expected);
		});
	});
});
