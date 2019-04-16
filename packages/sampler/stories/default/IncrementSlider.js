import IncrementSlider, {IncrementSliderBase, IncrementSliderTooltip} from '@enact/moonstone/IncrementSlider';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const IncrementSliderConfig = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);
const IncrementSliderTooltipConfig = mergeComponentMetadata('IncrementSliderTooltip', IncrementSliderTooltip);

IncrementSlider.displayName = 'IncrementSlider';

storiesOf('Moonstone', module)
	.add(
		'IncrementSlider',
		() => {
			const side = select('side', ['after', 'before', 'left', 'right'], IncrementSliderTooltipConfig, 'after');
			const tooltip = boolean('tooltip', IncrementSliderTooltipConfig);
			const percent = boolean('percent', IncrementSliderTooltipConfig);

			return (
				<IncrementSlider
					backgroundProgress={number('backgroundProgress', IncrementSliderConfig, {range: true, min: 0, max: 1, step: 0.01})}
					decrementIcon={select('decrementIcon', ['', ...decrementIcons], IncrementSliderConfig)}
					disabled={boolean('disabled', IncrementSliderConfig)}
					incrementIcon={select('incrementIcon', ['', ...incrementIcons], IncrementSliderConfig)}
					knobStep={number('knobStep', IncrementSliderConfig)}
					max={number('max', IncrementSliderConfig)}
					min={number('min', IncrementSliderConfig)}
					noFill={boolean('noFill', IncrementSliderConfig)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], IncrementSliderConfig)}
					step={number('step', IncrementSliderConfig)} // def: 1
				>
					{tooltip ? (
						<IncrementSliderTooltip
							percent={percent}
							side={side}
						/>
					) : null}
				</IncrementSlider>
			);
		},
		{
			info: {
				text: 'Basic usage of IncrementSlider'
			}
		}
	);
