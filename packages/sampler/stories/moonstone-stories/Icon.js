import {Icon, icons} from 'enact-moonstone/Icon';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

const iconNames = Object.keys(icons);

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Icon',
		() => (
			<Icon
				small={boolean('small')}
			>
				{select('icon', iconNames, 'plus')}
			</Icon>
		)
	);
