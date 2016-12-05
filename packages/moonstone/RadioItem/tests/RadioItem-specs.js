import React from 'react';
import {mount} from 'enzyme';
import RadioItem from '../RadioItem';
import css from '../RadioItem.less';

describe('RadioItem Specs', () => {
	it('should render correct icon when not selected', function () {
		const radioItem = mount(
			<RadioItem>
				Hello RadioItem
			</RadioItem>
		);

		const expected = 0;
		const actual = radioItem.find(`.${css.selected}`).length;

		expect(actual).to.equal(expected);
	});

	it('should render correct icon when selected', function () {
		const radioItem = mount(
			<RadioItem selected>
				Hello RadioItem
			</RadioItem>
		);

		const expected = 1;
		const actual = radioItem.find(`.${css.selected}`).length;

		expect(actual).to.equal(expected);
	});

});
