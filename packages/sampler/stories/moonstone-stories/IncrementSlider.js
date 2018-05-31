import IncrementSlider, {IncrementSliderBase, IncrementSliderTooltip} from '@enact/moonstone/IncrementSlider';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, nullify, smartSelect} from '../../src/utils';

IncrementSlider.displayName = 'IncrementSlider';
const Config = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);

storiesOf('Moonstone', module)
	.add(
		'IncrementSlider',
		withInfo({
			propTablesExclude: [IncrementSlider],
			text: 'Basic usage of IncrementSlider'
		})(() => {
			const side = smartSelect('side', ['after', 'before', 'left', 'right'], IncrementSliderTooltip, 'after');
			const tooltip = nullify(boolean('tooltip', false));
			const percent = nullify(boolean('percent', false));

			return (
				<IncrementSlider
					backgroundProgress={number('backgroundProgress', IncrementSliderBase.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
					decrementIcon={smartSelect('decrementIcon', ['', ...decrementIcons], Config)}
					disabled={boolean('disabled', false)}
					incrementIcon={smartSelect('incrementIcon', ['', ...incrementIcons], Config)}
					knobStep={number('knobStep')}
					max={number('max', IncrementSliderBase.defaultProps.max)}
					min={number('min', IncrementSliderBase.defaultProps.min)}
					noFill={boolean('noFill', false)}
					onChange={action('onChange')}
					orientation={smartSelect('orientation', ['horizontal', 'vertical'], Config)}
					step={number('step', 1)}
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
