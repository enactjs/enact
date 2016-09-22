import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

import ProgressBar, {ProgressBarBase} from 'enact-moonstone/ProgressBar';

const ProgressBarStories = storiesOf('ProgressBar').addDecorator(withKnobs);

ProgressBar.propTypes = Object.assign({}, ProgressBarBase.propTypes, ProgressBar.propTypes);
ProgressBar.defaultProps = Object.assign({}, ProgressBarBase.defaultProps, ProgressBar.defaultProps);
ProgressBar.displayName = 'ProgressBar';

ProgressBarStories
	.addWithInfo(
		'',
		'The basic ProgressBar.',
		() => (
			<ProgressBar
				onClick={action('onClick')}
				backgroundProgress={number('backgroundProgress')}
				max={number('max')}
				min={number('min')}
				progress={number('progress')}
				vertical={boolean('vertical')}
				disabled={boolean('disabled')}
			/>
		)
	)
;
