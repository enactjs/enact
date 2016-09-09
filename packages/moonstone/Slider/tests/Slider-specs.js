import React from 'react';
import {mount} from 'enzyme';
import Slider from '../Slider';
import css from '../Slider.less';

describe('Slider Specs', () => {
	it('Should have value of 50 on SliderBase\'s input', function () {
		const slider = mount(
			<Slider
				min={0}
				max={100}
				value={50}
				step={1}
			/>
		);

		expect(slider.find(`.${css.sliderBar}`).prop('value')).to.equal(50);
	});
});
