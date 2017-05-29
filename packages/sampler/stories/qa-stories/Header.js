import {Header} from '@enact/moonstone/Panels';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {text} from '@kadira/storybook-addon-knobs';

storiesOf('Header')
	.addWithInfo(
		'with RTL text',
		() => (
			<Header
				casing="preserve"
				type="compact"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'כתוביות למט')}
			/>
		)
	);
