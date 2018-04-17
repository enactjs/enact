import ProgressBar, {ProgressBarBase, ProgressBarTooltip} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ProgressBar', ProgressBarBase, ProgressBar);

// eslint-disable-next-line
function ProgressBarWithTooltip ({percent, side, tooltip, ...rest}) {
	return (
		<ProgressBar {...rest}>
			{tooltip ? (
				<ProgressBarTooltip
					percent={percent}
					side={side}
				/>
			) : null}
		</ProgressBar>
	);
}

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		withInfo({
			propTables: [Config],
			text: 'The basic ProgressBar'
		})(() => (
			<ProgressBarWithTooltip
				backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
				disabled={nullify(boolean('disabled', false))}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
				progress={number('progress', 0.4, {range: true, min: 0, max: 1, step: 0.01})}
				side={nullify(select('side', ['after', 'before', 'left', 'right'], 'before'))}
				tooltip={boolean('tooltip', false)}
			/>
		))
	);
