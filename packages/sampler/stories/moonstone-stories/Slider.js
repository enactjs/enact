import Changeable from '@enact/ui/Changeable';
import React from 'react';
import Slider, {SliderBase} from '@enact/moonstone/Slider';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

const ChangeableSlider = Changeable(Slider);
ChangeableSlider.propTypes = Object.assign({}, SliderBase.propTypes, Slider.propTypes);
ChangeableSlider.defaultProps = Object.assign({}, SliderBase.defaultProps, Slider.defaultProps, ChangeableSlider.defaultProps);
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
				backgroundProgress={number('backgroundProgress', ChangeableSlider.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				detachedKnob={boolean('detachedKnob', ChangeableSlider.defaultProps.detachedKnob)}
				disabled={boolean('disabled', ChangeableSlider.defaultProps.disabled)}
				knobStep={number('knobStep')}
				max={number('max', ChangeableSlider.defaultProps.max)}
				min={number('min', ChangeableSlider.defaultProps.min)}
				onChange={action('onChange')}
				onKnobMove={action('onKnobMove')}
				noTooltip={boolean('noTooltip', ChangeableSlider.defaultProps.noTooltip)}
				step={number('step', ChangeableSlider.defaultProps.step)}
				tooltipAsPercent={boolean('tooltipAsPercent', ChangeableSlider.defaultProps.tooltipAsPercent)}
				tooltipForceSide={boolean('tooltipForceSide', ChangeableSlider.defaultProps.tooltipForceSide)}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
				vertical={boolean('vertical', ChangeableSlider.defaultProps.vertical)}
				value={number('value', ChangeableSlider.defaultProps.value)}
			/>
		)
	);
