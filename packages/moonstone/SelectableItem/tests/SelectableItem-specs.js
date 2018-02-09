import React from 'react';
import {mount} from 'enzyme';
import SelectableItem from '../SelectableItem';
import css from '../SelectableIcon.less';

describe('SelectableItem Specs', () => {
	it('should render no icon when not selected', function () {
		const selectableItem = mount(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = 0;
		const actual = selectableItem.find(`.${css.selected}`).length;

		expect(actual).to.equal(expected);
	});

	it('should render correct icon when selected', function () {
		const selectableItem = mount(
			<SelectableItem selected>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = 1;
		const actual = selectableItem.find(`.${css.selected}`).length;

		expect(actual).to.equal(expected);
	});

});
