import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

IncrementSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
IncrementSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
IncrementSlider.displayName = 'IncrementSlider';

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of IncrementSlider',
		() => (
			<IncrementSlider
				backgroundPercent={number('backgroundPercent', IncrementSlider.defaultProps.backgroundPercent)}
				disabled={boolean('disabled', IncrementSlider.defaultProps.disabled)}
				height={text('height (vertical only)', IncrementSlider.defaultProps.height)}
				max={number('max', IncrementSlider.defaultProps.max)}
				min={number('min', IncrementSlider.defaultProps.min)}
				onChange={action('onChange')}
				step={number('step', IncrementSlider.defaultProps.step)}
				vertical={boolean('vertical', IncrementSlider.defaultProps.vertical)}
				value={number('value', IncrementSlider.defaultProps.value)}
			/>
		)
	);
