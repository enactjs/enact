import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {Slider, SliderBase} from '../Slider';
import {SliderDecorator} from '../../internal/SliderDecorator';
import css from '../Slider.less';

describe('Slider Specs', () => {
	it('should not fire change event on props change', function () {
		const handleChange = sinon.spy();

		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
				onChange={handleChange}
			/>
		);

		slider.setProps({value: 25});

		const expected = false;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should not fire change event more than once', function () {
		const handleChange = sinon.spy();
		const value = 25;

		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
				onChange={handleChange}
			/>
		);

		slider.find(`.${css.input}`).simulate('change', {target: {value}});

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should forward value in change event', function () {
		const handleChange = sinon.spy();
		const value = 25;

		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
				onChange={handleChange}
			/>
		);

		slider.find(`.${css.input}`).simulate('change', {target: {value}});

		const expected = value;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	// I don't feel super great about this test but I'm not sure how else to be able to check
	// that values that are applied directly to the DOM are the values that should be applied
	// This validates ENYO-3734 fix
	it('should apply the right knob position on startup', function () {
		const node = document.body.appendChild(document.createElement('div'));
		mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		const knob = document.querySelector(`.${css.knob}`);

		const expected = 'translate3d(50px, 0, 0)';
		const actual = knob.style.transform;

		node.remove();

		expect(actual).to.equal(expected);
	});

	it('should not position knob outside slider', function () {
		const node = document.body.appendChild(document.createElement('div'));
		// eslint-disable-next-line
		console.warn.restore();
		const spy = sinon.stub(console, 'warn');

		mount(
			<Slider
				min={0}
				max={100}
				value={150}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		const knob = document.querySelector(`.${css.knob}`);

		const expected = 'translate3d(100px, 0, 0)';
		const actual = knob.style.transform;

		const warningExpected = 'Warning: SliderDecorator "value" (150) greater than "max" (100)';
		const warningActual = spy.args[0][0];

		node.remove();

		expect(actual).to.equal(expected);
		expect(warningActual).to.equal(warningExpected);
	});

	it('should apply min/max on mount', function () {
		const node = document.body.appendChild(document.createElement('div'));
		mount(
			<Slider
				min={-100}
				max={0}
				value={-50}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		const knob = document.querySelector(`.${css.knob}`);

		const expected = 'translate3d(50px, 0, 0)';
		const actual = knob.style.transform;

		node.remove();

		expect(actual).to.equal(expected);
	});

	it('should update value, min, max together', function () {
		const node = document.body.appendChild(document.createElement('div'));
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		slider.setProps({min: -100, max: 0, value: -60});
		const knob = document.querySelector(`.${css.knob}`);

		const expected = 'translate3d(40px, 0, 0)';
		const actual = knob.style.transform;

		node.remove();

		expect(actual).to.equal(expected);
	});

	it('should clamp knob position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
		// eslint-disable-next-line
		console.warn.restore();
		const spy = sinon.stub(console, 'warn');
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={0}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		slider.setProps({min: 50});
		const knob = document.querySelector(`.${css.knob}`);

		const expected = 'translate3d(0px, 0, 0)';
		const actual = knob.style.transform;

		const warningExpected = 'Warning: SliderDecorator "value" (0) less than "min" (50)';
		const warningActual = spy.args[0][0];


		node.remove();

		expect(actual).to.equal(expected);
		expect(warningActual).to.equal(warningExpected);
	});

	it('should clamp bar position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
		// eslint-disable-next-line
		console.warn.restore();
		const spy = sinon.stub(console, 'warn');
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={0}
				step={1}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		slider.setProps({min: 50});
		const knob = document.querySelector(`.${css.fill}`);

		const expected = 'scale(0, 1) translateZ(0)';
		const actual = knob.style.transform;

		const warningExpected = 'Warning: SliderDecorator "value" (0) less than "min" (50)';
		const warningActual = spy.args[0][0];

		node.remove();

		expect(actual).to.equal(expected);
		expect(warningActual).to.equal(warningExpected);
	});

	// Note: This was causing a value out of bounds error, but should not have as
	// backgroundProgress is percent, not an absolute value
	it('should not change background position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
		// eslint-disable-next-line
		console.warn.restore();
		const spy = sinon.stub(console, 'warn');
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={0}
				step={1}
				backgroundProgress={0.3}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		slider.setProps({min: 50});
		const knob = document.querySelector(`.${css.load}`);

		const expected = 'scale(0.3, 1) translateZ(0)';
		const actual = knob.style.transform;

		const warningExpected = 'Warning: SliderDecorator "value" (0) less than "min" (50)';
		const warningActual = spy.args[0][0];

		node.remove();

		expect(actual).to.equal(expected);
		expect(warningActual).to.equal(warningExpected);
	});

	it('should set "aria-valuetext" to hint string when knob is active and vertical is false', function () {
		const Comp = SliderDecorator(SliderBase);
		const slider = mount(
			<Comp />
		);

		slider.find('Slider').prop('onActivate')();

		const expected = 'change a value with left right button';
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set "aria-valuetext" to hint string when knob is active and vertical is true', function () {
		const Comp = SliderDecorator(SliderBase);
		const slider = mount(
			<Comp vertical />
		);

		slider.find('Slider').prop('onActivate')();

		const expected = 'change a value with up down button';
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set "aria-valuetext" to value when value is changed', function () {
		const Comp = SliderDecorator(SliderBase);
		const slider = mount(
			<Comp value={10} />
		);

		const expected = 10;
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});
});
