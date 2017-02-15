import React from 'react';
import {shallow} from 'enzyme';
import {ExpandableListBase} from '../ExpandableList';

describe('ExpandableList', () => {
	describe('#aria-multiselectable', () => {
		it('should be true when select is multiple', function () {
			const expandableList = shallow(
				<ExpandableListBase select="multiple" />
			);

			const expected = true;
			const actual = expandableList.prop('aria-multiselectable');

			expect(actual).to.equal(expected);
		});
	});
});
