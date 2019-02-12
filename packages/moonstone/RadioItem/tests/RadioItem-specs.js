import React from 'react';
import {mount} from 'enzyme';
import RadioItem from '../RadioItem';
import css from '../RadioItem.module.less';

describe('RadioItem Specs', () => {
	test('should render correct icon when not selected', () => {
		const radioItem = mount(
			<RadioItem>
				Hello RadioItem
			</RadioItem>
		);

		const expected = 0;
		const actual = radioItem.find(`.${css.selected}`).length;

		expect(actual).toBe(expected);
	});

	test('should render correct icon when selected', () => {
		const radioItem = mount(
			<RadioItem selected>
				Hello RadioItem
			</RadioItem>
		);

		const expected = 1;
		const actual = radioItem.find(`.${css.selected}`).length;

		expect(actual).toBe(expected);
	});

});
