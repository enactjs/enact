import Slider, {SliderBase} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

Slider.propTypes = Object.assign({}, SliderBase.propTypes, Slider.propTypes);
Slider.defaultProps = Object.assign({}, SliderBase.defaultProps, Slider.defaultProps);
Slider.displayName = 'Slider';

delete Slider.propTypes.pressed;
delete Slider.defaultProps.pressed;
delete Slider.propTypes.defaultPressed;
delete Slider.defaultProps.defaultPressed;

storiesOf('Slider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Slider',
		() => (
			<Slider
				backgroundPercent={number('backgroundPercent', Slider.defaultProps.backgroundPercent)}
				disabled={boolean('disabled', Slider.defaultProps.disabled)}
				height={text('height', Slider.defaultProps.height)}
				max={number('max', Slider.defaultProps.max)}
				min={number('min', Slider.defaultProps.min)}
				onChange={action('onChange')}
				step={number('step', Slider.defaultProps.step)}
				vertical={boolean('vertical', Slider.defaultProps.vertical)}
				value={number('value', Slider.defaultProps.value)}
			/>
		)
	);
