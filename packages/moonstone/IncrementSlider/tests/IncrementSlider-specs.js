import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {IncrementSlider, IncrementSliderBase} from '../IncrementSlider';
import css from '../IncrementSlider.less';

describe('IncrementSlider Specs', () => {
	it('should decrement value', function () {
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

	it('should increment value', function () {
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

	it('should only call onChange once', function () {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		incrementSlider.find(`.${css.incrementButton}`).simulate('click');

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not call onChange on prop change', function () {
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

	it('should disable decrement button when value === min', function () {
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

	it('should disable increment button when value === max', function () {
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

	it('should invoke onIncrement when increment button is clicked', function () {
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

	it('should not invoke onIncrement when at upper bounds', function () {
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

	it('should invoke onDecrement when increment button is clicked', function () {
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

	it('should not invoke onDecrement when at lower bounds', function () {
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

	it('should use custom incrementIcon', function () {
		const icon = 'plus';
		const incrementSlider = mount(
			<IncrementSlider incrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.incrementButton} Icon`).prop('children');

		expect(actual).to.equal(expected);
	});

	it('should use custom decrementIcon', function () {
		const icon = 'minus';
		const incrementSlider = mount(
			<IncrementSlider decrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.decrementButton} Icon`).prop('children');

		expect(actual).to.equal(expected);
	});

	it('should set decrementButton "aria-label" to value and hint string', function () {
		const incrementSlider = mount(
			<IncrementSlider value={10} />
		);

		const expected = '10 press ok button to decrease the value';
		const actual = incrementSlider.find(`.${css.decrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should not set decrementButton "aria-label" when decrementButton is disabled', function () {
		const incrementSlider = mount(
			<IncrementSlider disabled value={10} />
		);

		const expected = null;
		const actual = incrementSlider.find(`.${css.decrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set incrementButton "aria-label" to value and hint string', function () {
		const incrementSlider = mount(
			<IncrementSlider value={10} />
		);

		const expected = '10 press ok button to increase the value';
		const actual = incrementSlider.find(`.${css.incrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should not set incrementButton "aria-label" when incrementButton is disabled', function () {
		const incrementSlider = mount(
			<IncrementSlider disabled value={10} />
		);

		const expected = null;
		const actual = incrementSlider.find(`.${css.incrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});
});
