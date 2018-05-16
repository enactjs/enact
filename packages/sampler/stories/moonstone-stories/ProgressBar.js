import ProgressBar, {ProgressBarBase, ProgressBarTooltip} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, number, select} from '@storybook/addon-knobs';
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
		})(() => {
			const side = nullify(select('side', ['after', 'before', 'left', 'right'], 'before'));
			const tooltip = nullify(boolean('tooltip', false));

			return (
				<ProgressBar
					backgroundProgress={number('backgroundProgress', 0.5, {range: true, min: 0, max: 1, step: 0.01})}
					disabled={nullify(boolean('disabled', false))}
					highlighted={nullify(boolean('highlighted', false))}
					orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
					progress={number('progress', 0.4, {range: true, min: 0, max: 1, step: 0.01})}
					side={nullify(select('side', ['after', 'before', 'left', 'right'], 'before'))}
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
