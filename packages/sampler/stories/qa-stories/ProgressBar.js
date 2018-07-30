import ProgressBar, {ProgressBarBase} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ProgressBar', ProgressBarBase, ProgressBar);

storiesOf('ProgressBar', module)
	.add(
		'The basic ProgressBar',
		() => (
			<ProgressBar
				backgroundProgress={number('backgroundProgress', Config, 0.5, {range: true, min: 0, max: 1, step: 0.01})}
				tooltip={boolean('tooltip', Config, false)}
				highlighted={boolean('highlighted', Config, false)}
				progress={number('progress', Config, 0.4, {range: true, min: 0, max: 1, step: 0.01})}
				orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
				disabled={boolean('disabled', Config, false)}
			/>
		),
		{propTables: [Config]}
	);
