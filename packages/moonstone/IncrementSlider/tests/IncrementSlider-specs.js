import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import IncrementSlider from '../IncrementSlider';
import css from '../IncrementSlider.less';

describe('SliderBase Specs', () => {
	it('Should decrement value', function () {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.decrementButton}`).simulate('click');

		const expected = value - 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('Should increment value', function () {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.incrementButton}`).simulate('click');

		const expected = value + 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('Should disable decrement button when value === min', function () {
		const incrementSlider = mount(
			<IncrementSlider
				value={0}
				min={0}
			/>
		);

		const expected = true;
		const actual = incrementSlider.find(`.${css.decrementButton}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('Should disable increment button when value === max', function () {
		const incrementSlider = mount(
			<IncrementSlider
				value={10}
				max={10}
			/>
		);

		const expected = true;
		const actual = incrementSlider.find(`.${css.incrementButton}`).prop('disabled');

		expect(actual).to.equal(expected);
	});
});
