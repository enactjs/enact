import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

import IncrementSlider, {IncrementSliderBase} from 'enact-moonstone/IncrementSlider';

const IncrementSliderStories = storiesOf('IncrementSlider').addDecorator(withKnobs);

IncrementSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
IncrementSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
IncrementSlider.displayName = 'IncrementSlider';

delete IncrementSlider.propTypes.onDecrement;
delete IncrementSlider.propTypes.onIncrement;

IncrementSliderStories
	.addWithInfo(
		'',
		'The basic IncrementSlider.',
		() => (
			<IncrementSlider
				backgroundPercent={number('backgroundPercent')}
				disabled={boolean('disabled')}
				height={text('height (vertical only)')}
				onChange={action('onChange')}
				max={number('max')}
				min={number('min')}
				step={number('step')}
				value={number('value')}
				vertical={boolean('vertical')}
			/>
		)
	)
;

