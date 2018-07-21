import {mount} from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import Slider from '../Slider';
import css from '../Slider.less';

const getNode = (slider) => slider.find(`div.${css.slider}`);

const focus = (slider) => getNode(slider).simulate('focus');
const blur = (slider) => getNode(slider).simulate('blur');
const activate = (slider) => getNode(slider).simulate('keyup', {keyCode: 13});
const keyDown = (keyCode) => (slider) => getNode(slider).simulate('keydown', {keyCode});

const leftKeyDown = keyDown(37);
const rightKeyDown = keyDown(39);
const upKeyDown = keyDown(38);
const downKeyDown = keyDown(40);

describe('Slider', () => {
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

	it('should set "aria-valuetext" to hint string when knob is active and vertical is false', function () {
		const slider = mount(
			<Slider />
		);

		slider.find('Slider').prop('onActivate')();
		slider.update();

		const expected = 'change a value with left right button';
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set "aria-valuetext" to hint string when knob is active and vertical is true', function () {
		const slider = mount(
			<Slider orientation="vertical" />
		);

		slider.find('Slider').prop('onActivate')();
		slider.update();

		const expected = 'change a value with up down button';
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should set "aria-valuetext" to value when value is changed', function () {
		const slider = mount(
			<Slider value={10} />
		);

		const expected = 10;
		const actual = slider.find('Slider').prop('aria-valuetext');

		expect(actual).to.equal(expected);
	});

	it('should activate the slider on enter keyup', () => {
		const subject = mount(
			<Slider />
		);

		activate(subject);

		const expected = 'active';
		const actual = subject.find('Slider').prop('active') ? 'active' : 'not active';

		expect(actual).to.equal(expected);
	});

	it('should deactivate the slider on blur', () => {
		const subject = mount(
			<Slider />
		);

		activate(subject);
		blur(subject);

		const expected = 'not active';
		const actual = subject.find('Slider').prop('active') ? 'active' : 'not active';

		expect(actual).to.equal(expected);
	});

	it('should not activate the slider on enter when activateOnFocus', () => {
		const subject = mount(
			<Slider activateOnFocus />
		);

		activate(subject);
		const expected = 'not active';
		const actual = subject.find('Slider').prop('active') ? 'active' : 'not active';

		expect(actual).to.equal(expected);
	});

	it('should decrement the value of horizontal slider on key left when active', () => {
		const subject = mount(
			<Slider defaultValue={50} />
		);

		activate(subject);
		leftKeyDown(subject);

		const expected = 49;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should decrement the value of horizontal slider on key left when activateOnFocus is true', () => {
		const subject = mount(
			<Slider defaultValue={50} activateOnFocus />
		);

		focus(subject);
		leftKeyDown(subject);

		const expected = 49;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should decrement the value of vertical slider on key down when active', () => {
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" />
		);

		activate(subject);
		downKeyDown(subject);

		const expected = 49;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should decrement the value of vertical slider on key down when activateOnFocus is true', () => {
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" activateOnFocus />
		);

		focus(subject);
		downKeyDown(subject);

		const expected = 49;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should increment the value of horizontal slider on key right when active', () => {
		const subject = mount(
			<Slider defaultValue={50} />
		);

		activate(subject);
		rightKeyDown(subject);

		const expected = 51;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should increment the value of horizontal slider on key right when activateOnFocus is true', () => {
		const subject = mount(
			<Slider defaultValue={50} activateOnFocus />
		);

		focus(subject);
		rightKeyDown(subject);

		const expected = 51;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should increment the value of vertical slider on key up when active', () => {
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" />
		);

		activate(subject);
		upKeyDown(subject);

		const expected = 51;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should increment the value of vertical slider on key up when activateOnFocus is true', () => {
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" activateOnFocus />
		);

		focus(subject);
		upKeyDown(subject);

		const expected = 51;
		const actual = subject.find('Slider').prop('value');

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightLeft on horizontal slider at min value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={0} onSpotlightLeft={handleSpotlight} />
		);

		focus(subject);
		leftKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightLeft on vertical slider at any value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" onSpotlightLeft={handleSpotlight} />
		);

		focus(subject);
		leftKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should not call onSpotlightLeft on horizontal slider at greater than min value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={1} onSpotlightLeft={handleSpotlight} />
		);

		focus(subject);
		leftKeyDown(subject);

		const expected = 'not called';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown on vertical slider at min value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={0} orientation="vertical" onSpotlightDown={handleSpotlight} />
		);

		focus(subject);
		downKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightDown on horizontal slider at any value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={50} onSpotlightDown={handleSpotlight} />
		);

		focus(subject);
		downKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should not call onSpotlightDown on vertical slider at greater than min value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={1} orientation="vertical" onSpotlightDown={handleSpotlight} />
		);

		focus(subject);
		downKeyDown(subject);

		const expected = 'not called';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight on horizontal slider at max value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={100} onSpotlightRight={handleSpotlight} />
		);

		focus(subject);
		rightKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightRight on vertical slider at any value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={50} orientation="vertical" onSpotlightRight={handleSpotlight} />
		);

		focus(subject);
		rightKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should not call onSpotlightRight on horizontal slider at less than max value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={99} onSpotlightRight={handleSpotlight} />
		);

		focus(subject);
		rightKeyDown(subject);

		const expected = 'not called';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp on vertical slider at max value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={100} max={100} orientation="vertical" onSpotlightUp={handleSpotlight} />
		);

		focus(subject);
		upKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should call onSpotlightUp on horizontal slider at any value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={50} onSpotlightUp={handleSpotlight} />
		);

		focus(subject);
		upKeyDown(subject);

		const expected = 'called once';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should not call onSpotlightUp on vertical slider at less than max value', () => {
		const handleSpotlight = sinon.spy();
		const subject = mount(
			<Slider defaultValue={99} orientation="vertical" onSpotlightUp={handleSpotlight} />
		);

		focus(subject);
		upKeyDown(subject);

		const expected = 'not called';
		const actual = callCount(handleSpotlight);

		expect(actual).to.equal(expected);
	});

	it('should set the tooltip to visible when focused', () => {
		const subject = mount(
			<Slider tooltip />
		);

		focus(subject);

		const expected = 'visible';
		const actual = subject.find('ProgressBarTooltip').prop('visible') ? 'visible' : 'not visible';

		expect(actual).to.equal(expected);
	});

	it('should set the tooltip to not visible when unfocused', () => {
		const subject = mount(
			<Slider tooltip />
		);

		const expected = 'not visible';
		const actual = subject.find('ProgressBarTooltip').prop('visible') ? 'visible' : 'not visible';

		expect(actual).to.equal(expected);
	});
});
