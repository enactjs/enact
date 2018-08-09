import Slider, {SliderTooltip} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const SliderConfig = mergeComponentMetadata('Slider', Slider);
const SliderTooltipConfig = mergeComponentMetadata('SliderTooltip', SliderTooltip);

Slider.displayName = 'Slider';
SliderTooltip.displayName = 'SliderTooltip';

storiesOf('Moonstone', module)
	.add(
		'Slider',
		withInfo({
			text: 'Basic usage of Slider'
		})(() => {
			const side = select('side', ['after', 'before', 'left', 'right'], SliderTooltipConfig, 'before');
			const tooltip = boolean('tooltip', SliderTooltipConfig);
			const percent = boolean('percent', SliderTooltipConfig);

			return (
				<Slider
					activateOnFocus={boolean('activateOnFocus', SliderConfig)}
					backgroundProgress={number('backgroundProgress', SliderConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={boolean('disabled', SliderConfig)}
					knobStep={number('knobStep', SliderConfig)}
					max={number('max', SliderConfig, 10)}
					min={number('min', SliderConfig, 0)}
					noFill={boolean('noFill', SliderConfig)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], SliderConfig, 'horizontal')}
					step={number('step', SliderConfig, 1)}
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
