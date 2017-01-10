import Changeable from '@enact/ui/Changeable';
import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

const ChangeableSlider = Changeable({mutable: true}, IncrementSlider);
ChangeableSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
ChangeableSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
ChangeableSlider.displayName = 'IncrementSlider';

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of IncrementSlider',
		() => (
			<ChangeableSlider
				backgroundProgress={number('backgroundProgress', ChangeableSlider.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				incrementIcon={select('incrementIcon', ['', 'plus'])}
				decrementIcon={select('decrementIcon', ['', 'minus'])}
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
