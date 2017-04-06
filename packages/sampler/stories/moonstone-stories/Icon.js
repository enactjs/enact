import Icon from '@enact/moonstone/Icon';
import Divider from '@enact/moonstone/Divider';
import iconNames from './icons';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

// import icons
import fwd from '../../images/icon-fwd-btn.png';
import play from '../../images/icon-play-btn.png';
import rew from '../../images/icon-rew-btn.png';

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Icon',
		() => (
			<div>
				<Icon
					disabled={nullify(boolean('disabled', false))}
					small={boolean('small', false)}
				>
					{select('src', ['', fwd, play, rew], '') + select('icon', ['', ...iconNames], 'plus') + text('custom icon', '')}
				</Icon>
				<br />
				<br />
				<Divider>All Icons</Divider>
				{iconNames.map((icon, index) => <Icon key={index}>{icon}</Icon>)}
			</div>
		)
	);
