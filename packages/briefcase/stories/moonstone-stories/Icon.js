import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

import Icon from 'enact-moonstone/Icon';

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of Icon',
		() => (
			<div>
				<Icon small={boolean('small')}>plus</Icon>
			</div>
		));
