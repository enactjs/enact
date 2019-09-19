import Slider, {SliderTooltip} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';
import {action, mergeComponentMetadata, nullify} from '../../src/utils';

const SliderConfig = mergeComponentMetadata('Slider', Slider);
const SliderTooltipConfig = mergeComponentMetadata('SliderTooltip', SliderTooltip);

Slider.displayName = 'Slider';
SliderTooltip.displayName = 'SliderTooltip';

storiesOf('Moonstone', module)
	.add(
		'Slider',
		() => {
			// added here to force Storybook to put the Slider tab first
			const disabled = boolean('disabled', SliderConfig);

			// tooltip is first so it appears at the top of the tab. the rest are alphabetical
			const tooltip = boolean('tooltip', SliderTooltipConfig);
			const percent = boolean('percent', SliderTooltipConfig);
			const position = select('position', ['', 'above', 'above left', 'above right', 'above before', 'above after', 'before', 'left', 'right', 'after', 'below', 'below left', 'below right', 'below before', 'below after'], SliderTooltipConfig, '');
			const side = nullify(select('side (Deprecated)', ['', 'after', 'before', 'left', 'right'], SliderTooltipConfig, ''));

			return (
				<Slider
					activateOnFocus={boolean('activateOnFocus', SliderConfig)}
					backgroundProgress={number('backgroundProgress', SliderConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={disabled}
					knobStep={number('knobStep', SliderConfig)}
					max={number('max', SliderConfig, 10)}
					min={number('min', SliderConfig, 0)}
					noFill={boolean('noFill', SliderConfig)}
					onActivate={action('onActivate')}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], SliderConfig, 'horizontal')}
					step={number('step', SliderConfig, 1)}
				>
					{tooltip ? (
						<SliderTooltip
							percent={percent}
							position={position}
							side={side}
						/>
					) : null}
				</Slider>
			);
		},
		{
			info: {
				text: 'Basic usage of Slider'
			}
		}
	);
