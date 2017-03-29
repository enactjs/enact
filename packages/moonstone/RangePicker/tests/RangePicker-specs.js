import React from 'react';
import {mount} from 'enzyme';
import RangePicker from '../RangePicker';
import css from '../../internal/Picker/Picker.less';

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
		const picker = mount(
			<RangePicker min={0} max={100} defaultValue={10} step={1} />
		);

		const button = picker.find(`.${css.incrementer}`);
		button.simulate('click');
		const expected = '11';
		const actual = picker.find('PickerItem').first().text();

		expect(actual).to.equal(expected);
	});

	it('should decrease by step amount on decrement press', function () {
		const picker = mount(
			<RangePicker min={0} max={100} defaultValue={10} step={1} />
		);

		const button = picker.find(`.${css.decrementer}`);
		button.simulate('click');
		const expected = '9';
		const actual = picker.find('PickerItem').first().text();

		expect(actual).to.equal(expected);
	});

	it('should pad the value', function () {
		const picker = mount(
			<RangePicker min={0} max={100} value={10} step={1} padded />
		);

		const expected = '010';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});

	it('should pad the value when min has more digits than max', function () {
		const picker = mount(
			<RangePicker min={-1000} max={100} value={10} step={1} padded />
		);

		const expected = '0010';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});
});
