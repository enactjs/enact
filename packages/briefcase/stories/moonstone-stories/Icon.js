import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import Icon from 'enact-moonstone/Icon';
import IconList from 'enact-moonstone/Icon/IconList';

const icons = Object.keys(IconList);

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of Icon',
		() => (
			<div>
				<Icon small={boolean('small')}>{select('icon', icons, 'plus')}</Icon>
			</div>
		));
