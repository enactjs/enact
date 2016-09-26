import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';

import Divider from 'enact-moonstone/Divider';

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of divider',
		() => (
			<Divider>divider text</Divider>
		)
	);
