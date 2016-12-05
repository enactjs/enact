import React from 'react';
import {mount} from 'enzyme';
import SelectableItem from '../SelectableItem';
import css from '../SelectableItem.less';

describe('SelectableItem Specs', () => {
	it('should render no icon when not selected', function () {
		const selectableItem = mount(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = css.selected;
		const actual = selectableItem.find('Icon').prop('className');

		expect(actual).to.not.contain(expected);
	});

	it('should render correct icon when selected', function () {
		const selectableItem = mount(
			<SelectableItem selected>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = css.selected;
		const actual = selectableItem.find('Icon').prop('className');

		expect(actual).to.contain(expected);
	});

});
