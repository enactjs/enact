import ProgressBar, {ProgressBarBase} from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

ProgressBar.propTypes = Object.assign({}, ProgressBarBase.propTypes, ProgressBar.propTypes);
ProgressBar.defaultProps = Object.assign({}, ProgressBarBase.defaultProps, ProgressBar.defaultProps);
ProgressBar.displayName = 'ProgressBar';

storiesOf('ProgressBar')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic ProgressBar',
		() => (
			<ProgressBar
				backgroundProgress={number('backgroundProgress', ProgressBar.defaultProps.backgroundProgress, {range: true, min: 0, max: 1, step: 0.01})}
				progress={number('progress', ProgressBar.defaultProps.progress, {range: true, min: 0, max: 1, step: 0.1})}
				vertical={boolean('vertical')}
				disabled={boolean('disabled')}
			/>
		)
	);
