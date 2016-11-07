import React from 'react';
import {mount} from 'enzyme';
import RadioItem from '../RadioItem';
import css from '../RadioItem.less';

describe('RadioItem Specs', () => {
	it('should render correct icon when not checked', function () {
		const radioItem = mount(
			<RadioItem>
				Hello RadioItem
			</RadioItem>
		);

		const expected = css.checked;
		const actual = radioItem.find('Icon').prop('className');

		expect(actual).to.not.contain(expected);
	});

	it('should render correct icon when checked', function () {
		const radioItem = mount(
			<RadioItem checked>
				Hello RadioItem
			</RadioItem>
		);

		const expected = css.checked;
		const actual = radioItem.find('Icon').prop('className');

		expect(actual).to.contain(expected);
	});

});
