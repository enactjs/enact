import Slider, {SliderBase} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Slider', SliderBase, Slider);
removeProps(Config, 'defaultPressed pressed');

storiesOf('Moonstone', module)
	.add(
		'Slider',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of Slider'
		})(() => (
			<Slider
				activateOnFocus={boolean('activateOnFocus', false)}
				backgroundProgress={number('backgroundProgress', SliderBase.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				disabled={boolean('disabled', false)}
				knobStep={number('knobStep')}
				max={number('max', SliderBase.defaultProps.max)}
				min={number('min', SliderBase.defaultProps.min)}
				noFill={boolean('noFill', false)}
				onChange={action('onChange')}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
				step={number('step', SliderBase.defaultProps.step)}
				tooltip={nullify(boolean('tooltip', false))}
				tooltipForceSide={nullify(boolean('tooltipForceSide', false))}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
			/>
		))
	);
