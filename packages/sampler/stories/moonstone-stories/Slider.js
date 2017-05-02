import Slider, {SliderBase} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Slider', SliderBase, Slider);
removeProps(Config, 'defaultPressed pressed');

storiesOf('Slider')
	.addWithInfo(
		' ',
		'Basic usage of Slider',
		() => (
			<Slider
				backgroundProgress={number('backgroundProgress', SliderBase.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				detachedKnob={nullify(boolean('detachedKnob', false))}
				disabled={boolean('disabled', false)}
				knobStep={number('knobStep')}
				max={number('max', SliderBase.defaultProps.max)}
				min={number('min', SliderBase.defaultProps.min)}
				onChange={action('onChange')}
				onKnobMove={action('onKnobMove')}
				step={number('step', SliderBase.defaultProps.step)}
				tooltip={nullify(boolean('tooltip', false))}
				tooltipAsPercent={nullify(boolean('tooltipAsPercent', false))}
				tooltipForceSide={nullify(boolean('tooltipForceSide', false))}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
				vertical={nullify(boolean('vertical', false))}
			/>
		),
		{propTables: [Config]}
	);
