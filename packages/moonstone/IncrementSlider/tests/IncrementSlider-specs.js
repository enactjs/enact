import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import IncrementSlider from '../IncrementSlider';
import css from '../IncrementSlider.less';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};
const decrement = (slider) => tap(slider.find('IconButton').first());
const increment = (slider) => tap(slider.find('IconButton').last());
const keyDown = (keyCode) => (node) => node.simulate('keydown', {keyCode});

const leftKeyDown = keyDown(37);
const rightKeyDown = keyDown(39);
const upKeyDown = keyDown(38);
const downKeyDown = keyDown(40);

const callCount = spy => {
	switch (spy.callCount) {
		case 0:
			return 'not called';
		case 1:
			return 'called once';
		default:
			return `called ${spy.callCount} times`;
	}
};

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

		decrement(incrementSlider);

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

		increment(incrementSlider);

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

		increment(incrementSlider);

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
		const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('disabled');

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
		const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('disabled');

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
		const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set decrementButton "aria-label" to decrementAriaLabel', function () {
		const label = 'decrement aria label';
		const incrementSlider = mount(
			<IncrementSlider value={10} decrementAriaLabel={label} />
		);

		const expected = `10 ${label}`;
		const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should not set decrementButton "aria-label" when decrementButton is disabled', function () {
		const incrementSlider = mount(
			<IncrementSlider disabled value={10} />
		);

		const expected = null;
		const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set incrementButton "aria-label" to value and hint string', function () {
		const incrementSlider = mount(
			<IncrementSlider value={10} />
		);

		const expected = '10 press ok button to increase the value';
		const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set incrementButton "aria-label" to incrementAriaLabel', function () {
		const label = 'increment aria label';
		const incrementSlider = mount(
			<IncrementSlider value={10} incrementAriaLabel={label} />
		);

		const expected = `10 ${label}`;
		const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should not set incrementButton "aria-label" when incrementButton is disabled', function () {
		const incrementSlider = mount(
			<IncrementSlider disabled value={10} />
		);

		const expected = null;
		const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

		expect(actual).to.equal(expected);
	});

	// test directional events from IncrementSliderButtons

	it('should call onSpotlightLeft from the decrement button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider onSpotlightLeft={handleSpotlight} />
		);

		leftKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightLeft from the decrement button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightLeft={handleSpotlight} />
		);

		leftKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightLeft from the increment button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightLeft={handleSpotlight} />
		);

		leftKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight from the increment button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider onSpotlightRight={handleSpotlight} />
		);

		rightKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight from the increment button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightRight={handleSpotlight} />
		);

		rightKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight from the decrement button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightRight={handleSpotlight} />
		);

		rightKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp from the decrement button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider onSpotlightUp={handleSpotlight} />
		);

		upKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp from the increment button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider onSpotlightUp={handleSpotlight} />
		);

		upKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp from the increment button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightUp={handleSpotlight} />
		);

		upKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown from the increment button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider onSpotlightDown={handleSpotlight} />
		);

		downKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown from the decrement button of horizontal IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightDown={handleSpotlight} />
		);

		downKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown from the decrement button of vertical IncrementSlider', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider orientation="vertical" onSpotlightDown={handleSpotlight} />
		);

		downKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	// test directional events at bounds of slider

	it('should call onSpotlightLeft from slider of horizontal IncrementSlider when value is at min', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider min={0} value={0} onSpotlightLeft={handleSpotlight} />
		);

		leftKeyDown(incrementSlider.find(`Slider.${css.slider}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight from slider of horizontal IncrementSlider when value is at max', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider max={100} value={100} onSpotlightRight={handleSpotlight} />
		);

		rightKeyDown(incrementSlider.find(`Slider.${css.slider}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown from slider of vertical IncrementSlider when value is at min', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider min={0} value={0} orientation="vertical" onSpotlightDown={handleSpotlight} />
		);

		downKeyDown(incrementSlider.find(`Slider.${css.slider}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp from slider of horizontal IncrementSlider when value is at max', function () {
		const handleSpotlight = sinon.spy();
		const incrementSlider = mount(
			<IncrementSlider max={100} value={100} orientation="vertical" onSpotlightUp={handleSpotlight} />
		);

		upKeyDown(incrementSlider.find(`Slider.${css.slider}`));

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});
});
