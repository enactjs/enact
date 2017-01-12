import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import IncrementSliderDelayValue from './Components/IncrementSliderDelayValue';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

IncrementSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
IncrementSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
IncrementSlider.displayName = 'IncrementSlider';

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'IncrementSlider PLAT-28221',
		() => (
			<div>
				<IncrementSlider
					backgroundPercent={IncrementSlider.defaultProps.backgroundPercent}
					incrementIcon={''}
					decrementIcon={''}
					disabled={IncrementSlider.defaultProps.disabled}
					max={IncrementSlider.defaultProps.max}
					min={IncrementSlider.defaultProps.min}
					onChange={action('onChange')}
					step={IncrementSlider.defaultProps.step}
					vertical={IncrementSlider.defaultProps.vertical}
					value={IncrementSlider.defaultProps.value}
				/>
				<IncrementSliderDelayValue
					backgroundPercent={number('backgroundPercent', IncrementSlider.defaultProps.backgroundPercent, {range: true, min: 0, max: 100})}
					incrementIcon={select('incrementIcon', ['', 'plus'])}
					decrementIcon={select('decrementIcon', ['', 'minus'])}
					disabled={boolean('disabled', IncrementSlider.defaultProps.disabled)}
					max={number('max', IncrementSlider.defaultProps.max)}
					min={number('min', IncrementSlider.defaultProps.min)}
					onChange={action('onChange')}
					step={number('step', IncrementSlider.defaultProps.step)}
					vertical={boolean('vertical', IncrementSlider.defaultProps.vertical)}
					value={number('value', IncrementSlider.defaultProps.value)}
				/>
			</div>
		)
	);