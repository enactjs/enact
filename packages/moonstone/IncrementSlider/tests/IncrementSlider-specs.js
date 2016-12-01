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
});
