import React from 'react';
import {shallow, mount} from 'enzyme';
import SelectableItem from '../SelectableItem';
import css from '../SelectableItem.less';

describe('SelectableItem Specs', () => {
	it('should render ToggleItem', function () {
		const selectableItem = shallow(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = false;
		const actual = selectableItem.find('ToggleItem').isEmpty();

		expect(actual).to.equal(expected);
	});

	it('should render no icon when not toggled', function () {
		const selectableItem = mount(
			<SelectableItem>
				Hello SelectableItem
			</SelectableItem>
		);

		const expected = css.dot;
		const actual = selectableItem.find('Icon').prop('className');
		const checked = css.checked;

		expect(actual).to.contain(expected);

		expect(actual).to.not.contain(checked);
	});

	it('should render correct icon when toggled', function () {
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
