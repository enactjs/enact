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

	it('should set the aria-valuetext attribute properly to read it when changing the value in <Picker>', function () {
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

		const expected = '2 previous item';
		const actual = picker.find(`.${css.incrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-label attribute properly in the down icon button of <Picker> when \'vertical\'', function () {
		const picker = mount(
			<Picker value={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2 next item';
		const actual = picker.find(`.${css.decrementer}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set the aria-valuetext attribute to read it when \'vertical\' and changing the value in <Picker>', function () {
		const picker = mount(
			<Picker value={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2';
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should be undefined of aria-valuetext when \'joined\' before changing the value in <Picker>', function () {
		const picker = mount(
			<Picker value={1} joined>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = undefined;
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should be undefined of aria-valuetext when \'joined\' and \'vertical\' before changing the value in <Picker>', function () {
		const picker = mount(
			<Picker value={1} joined orientation="vertical">
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = undefined;
		const actual = picker.find(`.${css.valueWrapper}`).prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the next icon button of <Picker> after clicking the next icon button', function () {
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

	it('should update the aria-label attribute properly in the previous icon button of <Picker> after clicking the next icon button', function () {
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

	it('should update aria-valuetext attribute properly to read it when changing the value in <Picker> after clicking the next icon button', function () {
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

	it('should update the aria-label attribute properly in the previous icon button of <Picker> after clicking the previous icon button when \'vertical\'', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);

		incrementer.simulate('click');

		const expected = '1 previous item';
		const actual = incrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update the aria-label attribute properly in the next icon button of <Picker> after clicking the previous icon button when \'vertical\'', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const decrementer = picker.find(`.${css.decrementer}`);

		incrementer.simulate('click');

		const expected = '1 next item';
		const actual = decrementer.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly to read it when \'vertical\' and changing the value in <Picker> after clicking the previous icon button', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');

		const expected = '1';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should update aria-valuetext attribute properly to read it when \'joined\' and changing the value in <Picker> after clicking the next icon button', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} joined>
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

	it('should update aria-valuetext attribute properly to read it when \'joined\', \'vertical\', and changing the value in <Picker> after clicking the previous icon button', function () {
		const picker = mount(
			<StatefulPicker defaultValue={1} joined orientation="vertical">
				{[1, 2, 3, 4]}
			</StatefulPicker>
		);
		const incrementer = picker.find(`.${css.incrementer}`);
		const valueWrapper = picker.find(`.${css.valueWrapper}`);

		incrementer.simulate('click');

		const expected = '1';
		const actual = valueWrapper.prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});
});
