import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

import Slider, {SliderBase} from 'enact-moonstone/Slider';

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
		'',
		'Basic usage of Slider.',
		() => (
			<Slider
				min={number('min')}
				max={number('max')}
				value={number('value')}
				step={number('step')}
				backgroundPercent={number('backgroundPercent')}
				vertical={boolean('vertical')}
				height={text('height')}
				disabled={boolean('disabled')}
				onChange={action('onChange')}
			/>
		)
	);
