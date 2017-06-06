import React from 'react';
import platform from '@enact/core/platform';
import {storiesOf} from '@kadira/storybook';

storiesOf('Platform')
	.addWithInfo(
		' ',
		'Detection',
		() => {
			const {platformName: name} = platform;
			const version = platform[name];
			return (
				<div>
					Detected: {name}
					<br />
					Version: {version}
				</div>
			);
		}
	);

