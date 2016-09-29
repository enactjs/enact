import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {SliderBase} from '../Slider';
import css from '../Slider.less';

describe('SliderBase Specs', () => {
	it('Should have value of 50 on input', function () {
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

		expect(sliderBase.find(`.${css.sliderBar}`).prop('value')).to.equal(50);
	});

	it('Should have width of 50', function () {
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

		expect(sliderBase.find(`.${css.fill}`).prop('style').width).to.equal('50%');
	});

	it('Should have fired change event ', function () {
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
