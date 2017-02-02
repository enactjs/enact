import IncrementSliderDelayValue from './components/IncrementSliderDelayValue';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'PLAT-28221',
		() => (
			<div>
				Focus on one of the IncrementSlider buttons. Every 5 seconds, the value will toggle between 0 and 100. Ensure that focus does not leave the IncrementSlider when this happens.
				<IncrementSliderDelayValue />
			</div>
		)
	);
