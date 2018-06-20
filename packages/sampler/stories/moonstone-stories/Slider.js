import Slider, {SliderTooltip} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Slider', Slider);

Slider.displayName = 'Slider';
SliderTooltip.displayName = 'SliderTooltip';

storiesOf('Moonstone', module)
	.add(
		'Slider',
		withInfo({
			propTablesExclude: [Slider, SliderTooltip],
			text: 'Basic usage of Slider'
		})(() => {
			const side = select('side', ['after', 'before', 'left', 'right'], SliderTooltip, 'before');
			const tooltip = boolean('tooltip', SliderTooltip);
			const percent = boolean('percent', SliderTooltip);

			return (
				<Slider
					activateOnFocus={boolean('activateOnFocus', Config)}
					backgroundProgress={number('backgroundProgress', Config, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={boolean('disabled', Config)}
					knobStep={number('knobStep', Config)}
					max={number('max', Config, 10)}
					min={number('min', Config, 0)}
					noFill={boolean('noFill', Config)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
					step={number('step', Config, 1)}
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
