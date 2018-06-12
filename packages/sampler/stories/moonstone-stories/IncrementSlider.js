import IncrementSlider, {IncrementSliderBase, IncrementSliderTooltip} from '@enact/moonstone/IncrementSlider';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
// import {number} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

IncrementSlider.displayName = 'IncrementSlider';
const Config = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);

storiesOf('Moonstone', module)
	.add(
		'IncrementSlider',
		withInfo({
			propTablesExclude: [IncrementSlider],
			text: 'Basic usage of IncrementSlider'
		})(() => {
			const side = select('side', ['after', 'before', 'left', 'right'], IncrementSliderTooltip, 'after');
			const tooltip = boolean('tooltip', IncrementSliderTooltip);
			const percent = boolean('percent', IncrementSliderTooltip);

			return (
				<IncrementSlider
					backgroundProgress={number('backgroundProgress', Config, {range: true, min: 0, max: 1, step: 0.01})}
					decrementIcon={select('decrementIcon', ['', ...decrementIcons], Config)}
					disabled={boolean('disabled', Config)}
					incrementIcon={select('incrementIcon', ['', ...incrementIcons], Config)}
					knobStep={number('knobStep', Config)}
					max={number('max', Config)}
					min={number('min', Config)}
					noFill={boolean('noFill', Config)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], Config)}
					step={number('step', Config)} // def: 1
				>
					{tooltip ? (
						<IncrementSliderTooltip
							percent={percent}
							side={side}
						/>
					) : null}
				</IncrementSlider>
			);
		})
	);
