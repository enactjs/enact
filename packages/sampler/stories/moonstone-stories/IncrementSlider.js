import IncrementSlider, {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);

storiesOf('Moonstone', module)
	.add(
		'IncrementSlider',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of IncrementSlider'
		})(() => (
			<IncrementSlider
				backgroundProgress={number('backgroundProgress', IncrementSliderBase.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
				disabled={boolean('disabled', false)}
				knobStep={number('knobStep')}
				max={number('max', IncrementSliderBase.defaultProps.max)}
				min={number('min', IncrementSliderBase.defaultProps.min)}
				noFill={boolean('noFill', false)}
				onChange={action('onChange')}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
				step={number('step', IncrementSliderBase.defaultProps.step)}
				tooltip={nullify(boolean('tooltip', false))}
				tooltipAsPercent={nullify(boolean('tooltipAsPercent', false))}
				tooltipForceSide={nullify(boolean('tooltipForceSide', false))}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
			/>
		))
	);
