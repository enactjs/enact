import React from 'react';
import platform from '@enact/core/platform';
import webosPlatform from '@enact/webos/platform';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

const {gesture, platformName, touch} = platform;
const version = platform[platformName];

const deviceType = () => {
	let device = '';
	for (let p in webosPlatform) {
		if (webosPlatform[p]) {
			device = p;
		}
	}
	return device;
};

storiesOf('Core', module)
	.add(
		'Platform',
		withInfo('Detection')(() => (
			<div>
				Detected: {platformName} {platform.webos ? `(${deviceType()})` : ''}
				<br />
				Version: {version}
				<br />
				Gesture support: {gesture ? 'true' : 'false'}
				<br />
				Touch support: {touch ? 'true' : 'false'}
			</div>
		))
	);
