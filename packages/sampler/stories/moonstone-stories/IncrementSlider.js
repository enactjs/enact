import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

IncrementSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
IncrementSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
IncrementSlider.displayName = 'IncrementSlider';

delete IncrementSlider.propTypes.onDecrement;
delete IncrementSlider.propTypes.onIncrement;

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic IncrementSlider',
		() => (
			<IncrementSlider
				backgroundPercent={number('backgroundPercent')}
				disabled={boolean('disabled')}
				height={text('height (vertical only)')}
				max={number('max')}
				min={number('min')}
				step={number('step')}
				value={number('value')}
				vertical={boolean('vertical')}
			/>
		)
	);
