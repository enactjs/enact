import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {SliderBase} from '../Slider';
import css from '../Slider.less';

describe('SliderBase Specs', () => {
	it('Should set value on input', function () {
		const sliderBase = mount(
			<SliderBase value={50} />
		);

		expect(sliderBase.find(`.${css.sliderBar}`).prop('value')).to.equal(50);
	});

	it('Should set max on input', function () {
		const sliderBase = mount(
			<SliderBase max={50} />
		);

		expect(sliderBase.find(`.${css.sliderBar}`).prop('max')).to.equal(50);
	});

	it('Should set min on input', function () {
		const sliderBase = mount(
			<SliderBase min={50} />
		);

		expect(sliderBase.find(`.${css.sliderBar}`).prop('min')).to.equal(50);
	});

	it('Should set step on input', function () {
		const sliderBase = mount(
			<SliderBase step={2} />
		);

		expect(sliderBase.find(`.${css.sliderBar}`).prop('step')).to.equal(2);
	});

	it('Should have fired change event', function () {
		const handleChange = sinon.spy();

		const sliderBase = mount(
			<SliderBase
				min={0}
				max={100}
				value={50}
				step={1}
				onChange={handleChange}
			/>
		);

		sliderBase.find('input').simulate('change', {target: {value: 25}});

		expect(handleChange.calledOnce).to.be.true();

	});
});
