import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {Slider} from '../Slider';
import css from '../Slider.less';

describe('Slider Specs', () => {
	it('Should not fire change event on props change', function () {
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


	// I don't feel super great about this test but I'm not sure how else to be able to check
	// that values that are applied directly to the DOM are the values that should be applied
	// This validates ENYO-3734 fix
	it('Should apply the right knob position on startup', function () {
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

	it('Should not position knob outside slider', function () {
		const node = document.body.appendChild(document.createElement('div'));
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

		node.remove();

		expect(actual).to.equal(expected);
	});

	it('Should apply min/max on mount', function () {
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

	it('Should update value, min, max together', function () {
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

	it('Should clamp knob position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
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

		node.remove();

		expect(actual).to.equal(expected);
	});

	it('Should clamp bar position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
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

		node.remove();

		expect(actual).to.equal(expected);
	});

	// Note: This was causing a value out of bounds error, but should not have as
	// backgroundPercent is percent, not an absolute value
	it('Should not change background position when min changed', function () {
		const node = document.body.appendChild(document.createElement('div'));
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={0}
				step={1}
				backgroundPercent={30}
				style={{width: '100px'}}
			/>,
			{attachTo: node}
		);

		slider.setProps({min: 50});
		const knob = document.querySelector(`.${css.load}`);

		const expected = 'scale(0.3, 1) translateZ(0)';
		const actual = knob.style.transform;

		node.remove();

		expect(actual).to.equal(expected);
	});
});
