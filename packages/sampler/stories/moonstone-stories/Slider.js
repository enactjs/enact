import Slider, {SliderBase, SliderTooltip} from '@enact/moonstone/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Slider', SliderBase, Slider);
removeProps(Config, 'defaultPressed pressed');

function SliderWithTooltip ({percent, side, forceSide, tooltip, ...rest}) {
	return (
		<Slider
			{...rest}
			tooltip={tooltip ? (
				<SliderTooltip
					forceSide={forceSide}
					percent={percent}
					side={side}
				/>
			) : null}
		/>
	);
}

storiesOf('Moonstone', module)
	.add(
		'Slider',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of Slider'
		})(() => (
			<SliderWithTooltip
				activateOnFocus={boolean('activateOnFocus', false)}
				backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
				disabled={boolean('disabled', false)}
				knobStep={number('knobStep')}
				max={number('max', 10)}
				min={number('min', 0)}
				noFill={boolean('noFill', false)}
				onChange={action('onChange')}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
				step={number('step', 0)}
				tooltip={nullify(boolean('tooltip', false))}
				percent={nullify(boolean('percent', false))}
				side={nullify(select('side', ['before', 'after']))}
				forceSide={nullify(boolean('forceSide', false))}
			/>
		))
	);
