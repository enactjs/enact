import ProgressBar from '@enact/moonstone/ProgressBar';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

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

