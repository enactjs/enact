import React from 'react';
import platform from '@enact/core/platform';
import webosPlatform from '@enact/webos/platform';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {Scroller} from '@enact/ui/Scroller';

function logObject (object) {
	return Object.keys(object)
		.filter(key => object[key] != null)
		.map(key => {
			let value = object[key];
			if (value === false) {
				value = 'false';
			} else if (value === true) {
				value = 'true';
			}
			return <div key={key}>{key}: {value}</div>;
		});
}

storiesOf('Core', module)
	.add(
		'Platform',
		withInfo('Detection')(() => (
			<Scroller>
				<h3>Platform:</h3>
				{logObject(platform)}
				<h3>webOS:</h3>
				{logObject(webosPlatform)}
			</Scroller>
		))
	);
