import Slider, {SliderTooltip} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

Slider.displayName = 'Slider';
SliderTooltip.displayName = 'SliderTooltip';

storiesOf('Moonstone', module)
	.add(
		'Slider',
		withInfo({
			propTablesExclude: [Slider, SliderTooltip],
			text: 'Basic usage of Slider'
		})(() => {
			const side = nullify(select('side', ['after', 'before', 'left', 'right'], 'before'));
			const tooltip = nullify(boolean('tooltip', false));
			const percent = nullify(boolean('percent', false));

			return (
				<Slider
					activateOnFocus={boolean('activateOnFocus', false)}
					backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
					disabled={boolean('disabled', false)}
					knobStep={number('knobStep')}
					max={number('max', 10)}
					min={number('min', 0)}
					noFill={boolean('noFill', false)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
					step={number('step', 1)}
				>
					{tooltip ? (
						<SliderTooltip
							percent={percent}
							side={side}
						/>
					) : null}
				</Slider>
			);
		})
	);
