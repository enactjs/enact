import React from 'react';
import {storiesOf} from '@kadira/storybook';

import Divider from 'enact-moonstone/Divider';

storiesOf('Divider')
	.addWithInfo(
		'with text',
		'Basic divider',
		() => (
			<Divider>divider text</Divider>
		));
