import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@kadira/storybook';

storiesOf('Divider')
	.addWithInfo(
		' ',
		'Basic usage of divider',
		() => (
			<Divider>divider text</Divider>
		)
	);
