import ProgressBar, {ProgressBarBase} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, number} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ProgressBar', ProgressBarBase, ProgressBar);

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		withInfo({
			propTables: [Config],
			text: 'The basic ProgressBar'
		})(() => (
			<ProgressBar
				backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
				emphasized={boolean('emphasized', false)}
				tooltip={boolean('tooltip', false)}
				progress={number('progress', 0.4, {range: true, min: 0, max: 1, step: 0.01})}
				tooltipForceSide={boolean('tooltipForceSide', false)}
				vertical={boolean('vertical', false)}
			/>
		))
	);
