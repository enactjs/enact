import Changeable from '@enact/ui/Changeable';
import React from 'react';
import Slider, {SliderBase} from '@enact/moonstone/Slider';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const ChangeableSlider = Changeable(Slider);
ChangeableSlider.displayName = 'Changeable(Slider)';

const Config = mergeComponentMetadata('Slider', SliderBase, Slider);

'defaultPressed pressed'
	.split(' ')
	.forEach(prop => {
		delete Config.propTypes[prop];
		delete Config.defaultProps[prop];
	});

storiesOf('Slider')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Slider',
		() => (
			<ChangeableSlider
				backgroundProgress={number('backgroundProgress', ChangeableSlider.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				detachedKnob={boolean('detachedKnob', ChangeableSlider.defaultProps.detachedKnob)}
				disabled={boolean('disabled', ChangeableSlider.defaultProps.disabled)}
				knobStep={number('knobStep')}
				max={number('max', ChangeableSlider.defaultProps.max)}
				min={number('min', ChangeableSlider.defaultProps.min)}
				onChange={action('onChange')}
				onKnobMove={action('onKnobMove')}
				step={number('step', ChangeableSlider.defaultProps.step)}
				tooltip={boolean('tooltip', ChangeableSlider.defaultProps.tooltip)}
				tooltipAsPercent={boolean('tooltipAsPercent', ChangeableSlider.defaultProps.tooltipAsPercent)}
				tooltipForceSide={boolean('tooltipForceSide', ChangeableSlider.defaultProps.tooltipForceSide)}
				tooltipSide={select('tooltipSide', ['before', 'after'], 'after')}
				vertical={boolean('vertical', ChangeableSlider.defaultProps.vertical)}
			/>
		),
		{propTables: [Config]}
	);
