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

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('value');

		expect(actual).to.equal(expected);
	});

	it('Should set max on input', function () {
		const sliderBase = mount(
			<SliderBase max={50} />
		);

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('max');

		expect(actual).to.equal(expected);
	});

	it('Should set min on input', function () {
		const sliderBase = mount(
			<SliderBase min={50} value={50} />
		);

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('min');

		expect(actual).to.equal(expected);
	});

	it('Should set step on input', function () {
		const sliderBase = mount(
			<SliderBase step={2} />
		);

		const expected = 2;
		const actual = sliderBase.find(`.${css.input}`).prop('step');

		expect(actual).to.equal(expected);
	});

	it('Should fire change event', function () {
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

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);

	});
});
