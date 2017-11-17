import React from 'react';
import {mount} from 'enzyme';
import SimpleIntegerPicker from '../SimpleIntegerPicker';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};
const decrement = (slider) => tap(slider.find('Icon').last());
const increment = (slider) => tap(slider.find('Icon').first());

describe('SimpleIntegerPicker', () => {
	it('should render a single child with the current value', function () {
		const picker = mount(
			<SimpleIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		const expected = 10;
		const actual = parseInt(picker.find('PickerItem').text());

		expect(actual).to.equal(expected);
	});

	it('should increase by step amount on increment press', function () {
		const picker = mount(
			<SimpleIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		increment(picker);

		const expected = 11;
		const actual = parseInt(picker.find('PickerItem').first().text());

		expect(actual).to.equal(expected);
	});

	it('should decrease by step amount on decrement press', function () {
		const picker = mount(
			<SimpleIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		decrement(picker);

		const expected = 9;
		const actual = parseInt(picker.find('PickerItem').first().text());

		expect(actual).to.equal(expected);
	});

});
