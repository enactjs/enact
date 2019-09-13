import ProgressBar, {ProgressBarTooltip} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const ProgressBarConfig = mergeComponentMetadata('ProgressBar', ProgressBar);
const ProgressBarTooltipConfig = mergeComponentMetadata('ProgressBarTooltip', ProgressBarTooltip);

ProgressBar.displayName = 'ProgressBar';
ProgressBarTooltip.displayName = 'ProgressBarTooltip';

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		() => {
			const tooltip = boolean('tooltip', ProgressBarTooltipConfig);
			const position = select('position', ['', 'above', 'above left', 'above right', 'above before', 'above after', 'before', 'left', 'right', 'after', 'below', 'below left', 'below right', 'below before', 'below after'], ProgressBarTooltipConfig, '');
			const side = select('side (Deprecated)', ['', 'after', 'before', 'left', 'right'], ProgressBarTooltipConfig, '');

			return (
				<ProgressBar
					backgroundProgress={number('backgroundProgress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={boolean('disabled', ProgressBarConfig)}
					highlighted={boolean('highlighted', ProgressBarConfig)}
					orientation={select('orientation', ['horizontal', 'vertical'], ProgressBarConfig, 'horizontal')}
					progress={number('progress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.4)}
				>
					{tooltip ? (
						<ProgressBarTooltip
							position={position}
							side={side}
						/>
					) : null}
				</ProgressBar>
			);
		},
		{
			info: {
				text: 'The basic ProgressBar'
			}
		}
	);
