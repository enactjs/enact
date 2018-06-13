import ProgressBar, {ProgressBarTooltip} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ProgressBar', ProgressBar);

ProgressBar.displayName = 'ProgressBar';
ProgressBarTooltip.displayName = 'ProgressBarTooltip';

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		withInfo({
			propTablesExclude: [ProgressBar, ProgressBarTooltip],
			text: 'The basic ProgressBar'
		})(() => {
			const side = select('side', ['after', 'before', 'left', 'right'], ProgressBarTooltip, 'before');
			const tooltip = boolean('tooltip', ProgressBarTooltip);

			return (
				<ProgressBar
					backgroundProgress={number('backgroundProgress', Config, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={boolean('disabled', Config)}
					highlighted={boolean('highlighted', Config)}
					orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
					progress={number('progress', Config, {range: true, min: 0, max: 1, step: 0.01}, 0.4)}
					side={select('side', ['after', 'before', 'left', 'right'], Config, 'before')}
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
