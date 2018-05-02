import ProgressBar, {ProgressBarBase} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, number, select} from '@storybook/addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ProgressBar', ProgressBarBase, ProgressBar);

storiesOf('ProgressBar', module)
	.add(
		'The basic ProgressBar',
		() => (
			<ProgressBar
				backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
				tooltip={boolean('tooltip', false)}
				progress={number('progress', 0.4, {range: true, min: 0, max: 1, step: 0.01})}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
				disabled={nullify(boolean('disabled', false))}
			/>
		),
		{propTables: [Config]}
	);
