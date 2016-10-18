import {Icon, icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

// import icons
import fwd from '../../images/icon-fwd-btn.png';
import play from '../../images/icon-play-btn.png';
import rew from '../../images/icon-rew-btn.png';

const iconNames = Object.keys(icons);

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Icon',
		() => (
			<Icon
				small={boolean('small')}
				src={select('src', ['', fwd, play, rew], '')}
			>
				{select('icon', ['', ...iconNames], 'plus')}
			</Icon>
		)
	);
