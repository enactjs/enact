import React from 'react';
import {mount, shallow} from 'enzyme';
import {RangePicker, RangePickerBase} from '../RangePicker';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};
const decrement = (slider) => tap(slider.find('IconButton').first());
const increment = (slider) => tap(slider.find('IconButton').last());

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

		increment(picker);

		const expected = '11';
		const actual = picker.find('PickerItem').first().text();

		expect(actual).to.equal(expected);
	});

	it('should decrease by step amount on decrement press', function () {
		const picker = mount(
			<RangePicker min={0} max={100} defaultValue={10} step={1} />
		);

		decrement(picker);

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

	it('should be disabled when limited to a single value', function () {
		const picker = shallow(
			<RangePickerBase min={0} max={0} value={0} />
		);

		const actual = picker.find('SpottablePicker').last().prop('disabled');
		expect(actual).to.be.true();
	});
});
