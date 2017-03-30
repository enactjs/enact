import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);

storiesOf('IncrementSlider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of IncrementSlider',
		() => (
			<IncrementSlider
				backgroundProgress={number('backgroundProgress', IncrementSliderBase.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
				disabled={boolean('disabled', false)}
				knobStep={number('knobStep')}
				max={number('max', IncrementSliderBase.defaultProps.max)}
				min={number('min', IncrementSliderBase.defaultProps.min)}
				onChange={action('onChange')}
				step={number('step', IncrementSliderBase.defaultProps.step)}
				tooltip={nullify(boolean('tooltip', false))}
				tooltipAsPercent={nullify(boolean('tooltipAsPercent', false))}
				tooltipForceSide={nullify(boolean('tooltipForceSide', false))}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
				vertical={nullify(boolean('vertical', false))}
			/>
		),
		{propTables: [Config]}
	);
