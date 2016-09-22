import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, text} from '@kadira/storybook-addon-knobs';

import IncrementSlider, {IncrementSliderBase} from 'enact-moonstone/IncrementSlider';

const IncrementSliderStories = storiesOf('IncrementSlider').addDecorator(withKnobs);

IncrementSlider.propTypes = Object.assign({}, IncrementSliderBase.propTypes, IncrementSlider.propTypes);
IncrementSlider.defaultProps = Object.assign({}, IncrementSliderBase.defaultProps, IncrementSlider.defaultProps);
IncrementSlider.displayName = 'IncrementSlider';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

IncrementSliderStories
	.addWithInfo(
		'',
		'The basic IncrementSlider.',
		() => (
			<IncrementSlider
				height={text('height (vertical only)', '300px')}
				onChange={action('onChange')}
			    max={number('max', 100)}
			    min={number('min', 0)}
			    step={number('step', 1)}
			    value={number('value', 0)}
			    vertical={boolean('vertical')}
			/>
		)
	)
;

