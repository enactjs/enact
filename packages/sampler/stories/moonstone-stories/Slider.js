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
				backgroundPercent={number('backgroundPercent')}
				disabled={boolean('disabled')}
				height={text('height')}
				min={number('min')}
				max={number('max')}
				onChange={action('onChange')}
				step={number('step')}
				vertical={boolean('vertical')}
			/>
		)
	);
