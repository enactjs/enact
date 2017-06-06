import React from 'react';
import platform from '@enact/core/platform';
import {storiesOf} from '@kadira/storybook';

storiesOf('Platform')
	.addWithInfo(
		' ',
		'Detection',
		() => {
			const {gesture, platformName: name, touch} = platform;
			const version = platform[name];
			return (
				<div>
					Detected: {name}
					<br />
					Version: {version}
					<br />
					Gesture support: {gesture ? 'true' : 'false'}
					<br />
					Touch support: {touch ? 'true' : 'false'}
				</div>
			);
		}
	);

