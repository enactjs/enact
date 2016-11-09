import React from 'react';
import {mount} from 'enzyme';
import SelectableItem from '../SelectableItem';
import css from '../SelectableItem.less';

describe('SelectableItem Specs', () => {
	it('should render no icon when not checked', function () {
		const selectableItem = mount(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = css.checked;
		const actual = selectableItem.find('Icon').prop('className');

		expect(actual).to.not.contain(expected);
	});

	it('should render correct icon when checked', function () {
		const selectableItem = mount(
			<SelectableItem checked>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = css.checked;
		const actual = selectableItem.find('Icon').prop('className');

		expect(actual).to.contain(expected);
	});

});
