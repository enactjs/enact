import React from 'react';
import {mount} from 'enzyme';
import RangePicker from '../RangePicker';
import Changeable from '@enact/ui/Changeable';
import css from '../../Picker/Picker.less';

describe('RangePicker Specs', () => {
	it('should render a single child with the current value', function () {
		const picker = mount(
			<RangePicker min={-10} max={20} value={10} />
		);

		const expected = '10';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});

	it('should increase by step amount on increment press', function () {
		const StatefulRangePicker = Changeable(RangePicker);

		const picker = mount(
			<StatefulRangePicker min={0} max={100} defaultValue={10} step={1} />
		);

		const button = picker.find(`.${css.incrementer}`);
		button.simulate('click');
		const expected = '11';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});

	it('should increase by step amount on decrement press', function () {
		const StatefulRangePicker = Changeable(RangePicker);

		const picker = mount(
			<StatefulRangePicker min={0} max={100} defaultValue={10} step={1} />
		);

		const button = picker.find(`.${css.decrementer}`);
		button.simulate('click');
		const expected = '9';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});
});
