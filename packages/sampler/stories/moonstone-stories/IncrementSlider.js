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
				backgroundPercent={number('backgroundPercent')}
				disabled={boolean('disabled')}
				height={text('height (vertical only)')}
				max={number('max')}
				min={number('min')}
				onChange={action('onChange')}
				step={number('step')}
				vertical={boolean('vertical')}
			/>
		)
	);
