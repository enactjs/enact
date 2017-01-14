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
				backgroundProgress={number('backgroundProgress', 0)}
				progress={number('progress', 0)}
				vertical={boolean('vertical', false)}
				disabled={boolean('disabled', false)}
			/>
		)
	);

