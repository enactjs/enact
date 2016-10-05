import ProgressBar, {ProgressBarBase} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, number} from '@kadira/storybook-addon-knobs';

ProgressBar.propTypes = Object.assign({}, ProgressBarBase.propTypes, ProgressBar.propTypes);
ProgressBar.defaultProps = Object.assign({}, ProgressBarBase.defaultProps, ProgressBar.defaultProps);
ProgressBar.displayName = 'ProgressBar';

storiesOf('ProgressBar')
	.addWithInfo(
		' ',
		'The basic ProgressBar',
		() => (
			<ProgressBar
				backgroundProgress={number('backgroundProgress')}
				max={number('max')}
				min={number('min')}
				progress={number('progress')}
				vertical={boolean('vertical')}
				disabled={boolean('disabled')}
			/>
		)
	);
