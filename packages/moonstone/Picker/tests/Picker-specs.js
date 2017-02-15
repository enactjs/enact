import React from 'react';
import {mount} from 'enzyme';
import Changeable from '@enact/ui/Changeable';
import Picker from '../Picker';
import css from '../../internal/Picker/Picker.less';

const StatefulPicker = Changeable(Picker);

describe('Picker Specs', () => {
	it('should render selected child wrapped with <PickerItem/>', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});

	it('should set the max of <Picker> to be one less than the number of children', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = 3;
		const actual = picker.find('Picker').last().prop('max');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-label attribute properly in the next icon button of <Picker>', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 next item';
		const actual = picker.find(`.${css.incrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-label attribute properly in the previous icon button of <Picker>', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 previous item';
		const actual = picker.find(`.${css.decrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-valuetext attribute for screen readers to read a value when changing the value in <Picker>', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2';
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-label attribute properly in the up icon button of <Picker> when \'vertical\'', function () {
		const picker = mount(
			<Picker value={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 next item';
		const actual = picker.find(`.${css.incrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-label attribute properly in the down icon button of <Picker> when \'vertical\'', function () {
		const picker = mount(
			<Picker value={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 previous item';
		const actual = picker.find(`.${css.decrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-valuetext attribute for screen readers to read a value when \'vertical\' and changing the value in <Picker>', function () {
		const picker = mount(
			<Picker value={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2';
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should be null of aria-valuetext when \'joined\'', function () {
		const picker = mount(
			<Picker value={1} joined>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 change a value with left right button';
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should be null of aria-valuetext when \'joined\' and \'vertical\'', function () {
		const picker = mount(
			<Picker value={1} joined orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 change a value with up down button';
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the next icon button of <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1}>
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);

		incrementer.simulate('click');

		const expected = '3 next item';
		const actual = incrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the previous icon button of <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1}>
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const decrementer = picker.find(`.${css.decrementer}`);

		incrementer.simulate('click');
		
		const expected = '3 previous item';
		const actual = decrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly for screen readers to read a value when changing the value in <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1}>
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');
		
		const expected = '3';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the up icon button of <Picker> after clicking when \'vertical\'', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);

		incrementer.simulate('click');

		// Even though clicking the icon button with `css.incrementer` in a <Picker>, the value of the <Picker> decrease. So the expected value is not 3 but 1.
		const expected = '1 next item';
		const actual = incrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the down icon button of <Picker> after clicking when \'vertical\'', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const decrementer = picker.find(`.${css.decrementer}`);

		incrementer.simulate('click');
		
		// Even though clicking the icon button with `css.incrementer` in a <Picker>, the value of the <Picker> decrease. So the expected value is not 3 but 1.
		const expected = '1 previous item';
		const actual = decrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly for screen readers to read a value when \'vertical\' and changing the value in <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');
		
		// Even though clicking the icon button with `css.incrementer` in a <Picker>, the value of the <Picker> decrease. So the expected value is not 3 but 1.
		const expected = '1';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly for screen readers to read a value when \'joined\' and changing the value in <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} joined>
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');
		
		const expected = '3 change a value with left right button';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly for screen readers to read a value when \'joined\', \'vertical\', and changing the value in <Picker> after clicking', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} joined orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');
		
		// Even though clicking the icon button with `css.incrementer` in a <Picker>, the value of the <Picker> decrease. So the expected value is not 3 but 1.
		const expected = '1 change a value with up down button';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});
});
