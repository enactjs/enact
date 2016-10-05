import Slider, {SliderBase} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, number, text} from '@kadira/storybook-addon-knobs';

Slider.propTypes = Object.assign({}, SliderBase.propTypes, Slider.propTypes);
Slider.defaultProps = Object.assign({}, SliderBase.defaultProps, Slider.defaultProps);
Slider.displayName = 'Slider';

delete Slider.propTypes.pressed;
delete Slider.defaultProps.pressed;
delete Slider.propTypes.defaultPressed;
delete Slider.defaultProps.defaultPressed;

storiesOf('Slider')
	.addWithInfo(
		' ',
		'Basic usage of Slider',
		() => (
			<Slider
				min={number('min')}
				max={number('max')}
				step={number('step')}
				backgroundPercent={number('backgroundPercent')}
				vertical={boolean('vertical')}
				height={text('height')}
				disabled={boolean('disabled')}
			/>
		)
	);
