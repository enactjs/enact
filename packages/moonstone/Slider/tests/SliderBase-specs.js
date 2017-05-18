import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {SliderBase} from '../Slider';
import css from '../Slider.less';

describe('SliderBase Specs', () => {
	it('should set value on input', function () {
		const sliderBase = mount(
			<SliderBase value={50} />
		);

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('value');

		expect(actual).to.equal(expected);
	});

	it('should set max on input', function () {
		const sliderBase = mount(
			<SliderBase max={50} />
		);

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('max');

		expect(actual).to.equal(expected);
	});

	it('should set min on input', function () {
		const sliderBase = mount(
			<SliderBase min={50} value={50} />
		);

		const expected = 50;
		const actual = sliderBase.find(`.${css.input}`).prop('min');

		expect(actual).to.equal(expected);
	});

	it('should set step on input', function () {
		const sliderBase = mount(
			<SliderBase step={2} />
		);

		const expected = 2;
		const actual = sliderBase.find(`.${css.input}`).prop('step');

		expect(actual).to.equal(expected);
	});

	it('should fire change event', function () {
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

	describe('tooltip', () => {
		it('should only show tooltip when tooltip is true and focused', function () {
			const sliderBase = mount(
				<SliderBase tooltip focused />
			);

			const expected = 1;
			const actual = sliderBase.find('SliderTooltip').length;

			expect(actual).to.equal(expected);
		});

		it('should not show tooltip when not focused', function () {
			const sliderBase = mount(
				<SliderBase tooltip />
			);

			const expected = 0;
			const actual = sliderBase.find('SliderTooltip').length;

			expect(actual).to.equal(expected);
		});

		it('should display custom value if children is provided', function () {
			const customValue = 'custom value';
			const sliderBase = mount(
				<SliderBase tooltip focused>
					{customValue}
				</SliderBase>
			);

			const expected = customValue.toUpperCase();
			const actual = sliderBase.find('SliderTooltip').text();

			expect(actual).to.equal(expected);
		});

		it('should not display custom value if children is provided but not focused', function () {
			const customValue = 'custom value';
			const sliderBase = mount(
				<SliderBase tooltip>
					{customValue}
				</SliderBase>
			);

			const expected = 0;
			const actual = sliderBase.find('SliderTooltip').length;

			expect(actual).to.equal(expected);
		});

		const CustomTooltip = () => <div />;

		it('should display custom tooltip component if children is provided', function () {
			const sliderBase = mount(
				<SliderBase>
					<CustomTooltip />
				</SliderBase>
			);

			const expected = 1;
			const actual = sliderBase.find('CustomTooltip').length;

			expect(actual).to.equal(expected);
		});
	});
});
