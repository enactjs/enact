import ProgressBar, {ProgressBarTooltip} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const ProgressBarConfig = mergeComponentMetadata('ProgressBar', ProgressBar);
const ProgressBarTooltipConfig = mergeComponentMetadata('ProgressBarTooltip', ProgressBarTooltip);

ProgressBar.displayName = 'ProgressBar';
ProgressBarTooltip.displayName = 'ProgressBarTooltip';

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		withInfo({
			propTablesExclude: [ProgressBar, ProgressBarTooltip],
			text: 'The basic ProgressBar'
		})(() => {
			const side = select('side', ['after', 'before', 'left', 'right'], ProgressBarTooltipConfig, 'before');
			const tooltip = boolean('tooltip', ProgressBarTooltipConfig);

			return (
				<ProgressBar
					backgroundProgress={number('backgroundProgress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={boolean('disabled', ProgressBarConfig)}
					highlighted={boolean('highlighted', ProgressBarConfig)}
					orientation={select('orientation', ['horizontal', 'vertical'], ProgressBarConfig, 'horizontal')}
					progress={number('progress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.4)}
					side={select('side', ['after', 'before', 'left', 'right'], ProgressBarConfig, 'before')}
				>
					{tooltip ? (
						<ProgressBarTooltip
							side={side}
						/>
					) : null}
				</ProgressBar>
			);
		})
	);
