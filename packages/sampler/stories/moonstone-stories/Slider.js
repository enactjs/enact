import Changeable from '@enact/ui/Changeable';
import React from 'react';
import Slider, {SliderBase} from '@enact/moonstone/Slider';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

const ChangeableSlider = Changeable({mutable: true}, Slider);
ChangeableSlider.propTypes = Object.assign({}, SliderBase.propTypes, Slider.propTypes);
ChangeableSlider.defaultProps = Object.assign({}, SliderBase.defaultProps, Slider.defaultProps);
ChangeableSlider.displayName = 'Slider';

delete ChangeableSlider.propTypes.pressed;
delete ChangeableSlider.defaultProps.pressed;
delete ChangeableSlider.propTypes.defaultPressed;
delete ChangeableSlider.defaultProps.defaultPressed;

storiesOf('Slider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Slider',
		() => (
			<ChangeableSlider
				backgroundProgress={number('backgroundProgress', ChangeableSlider.defaultProps.backgroundProgress, {range: true, min: Slider.defaultProps.mim, max: Slider.defaultProps.max, step: ChangeableSlider.defaultProps.step})}
				detachedKnob={boolean('detachedKnob', ChangeableSlider.defaultProps.detachedKnob)}
				disabled={boolean('disabled', ChangeableSlider.defaultProps.disabled)}
				max={number('max', ChangeableSlider.defaultProps.max)}
				min={number('min', ChangeableSlider.defaultProps.min)}
				onChange={action('onChange')}
				step={number('step', ChangeableSlider.defaultProps.step)}
				vertical={boolean('vertical', ChangeableSlider.defaultProps.vertical)}
				value={number('value', ChangeableSlider.defaultProps.value)}
			/>
		)
	);
