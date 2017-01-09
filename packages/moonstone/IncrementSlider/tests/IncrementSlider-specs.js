import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {IncrementSlider, IncrementSliderBase} from '../IncrementSlider';
import css from '../IncrementSlider.less';

describe('IncrementSlider Specs', () => {
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

	it('Should not call onChange on prop change', function () {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		incrementSlider.setProps({onChange: handleChange, value: value + 1});

		const expected = false;
		const actual = handleChange.called;

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

	it('Should invoke onIncrement when increment button is clicked', function () {
		const handleIncrement = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSliderBase
				onIncrement={handleIncrement}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.incrementButton}`).simulate('click');

		const expected = true;
		const actual = handleIncrement.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('Should not invoke onIncrement when at upper bounds', function () {
		const handleIncrement = sinon.spy();
		const value = 100;
		const incrementSlider = mount(
			<IncrementSliderBase
				onIncrement={handleIncrement}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.incrementButton}`).simulate('click');

		const expected = false;
		const actual = handleIncrement.called;

		expect(actual).to.equal(expected);
	});

	it('Should invoke onDecrement when increment button is clicked', function () {
		const handleDecrement = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSliderBase
				onDecrement={handleDecrement}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.decrementButton}`).simulate('click');

		const expected = true;
		const actual = handleDecrement.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('Should not invoke onDecrement when at lower bounds', function () {
		const handleDecrement = sinon.spy();
		const value = 0;
		const incrementSlider = mount(
			<IncrementSliderBase
				onDecrement={handleDecrement}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.decrementButton}`).simulate('click');

		const expected = false;
		const actual = handleDecrement.called;

		expect(actual).to.equal(expected);
	});

	it('Should use custom incrementIcon', function () {
		const icon = 'plus';
		const incrementSlider = mount(
			<IncrementSlider incrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.incrementButton} Icon`).prop('children');

		expect(actual).to.equal(expected);
	});

	it('Should use custom decrementIcon', function () {
		const icon = 'minus';
		const incrementSlider = mount(
			<IncrementSlider decrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.decrementButton} Icon`).prop('children');

		expect(actual).to.equal(expected);
	});
});
