import React from 'react';
import {mount} from 'enzyme';
import SelectableItem from '../SelectableItem';
import css from '../SelectableIcon.less';

describe('SelectableItem Specs', () => {
	test('should render no icon when not selected', () => {
		const selectableItem = mount(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = 0;
		const actual = selectableItem.find(`.${css.selected}`).length;

		expect(actual).toBe(expected);
	});

	test('should render correct icon when selected', () => {
		const selectableItem = mount(
			<SelectableItem selected>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = 1;
		const actual = selectableItem.find(`.${css.selected}`).length;

		expect(actual).toBe(expected);
	});

});
