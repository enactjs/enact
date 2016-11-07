import IconButton, {IconButtonBase} from '@enact/moonstone/IconButton';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

// import icons
import fwd from '../../images/icon-fwd-btn.png';
import play from '../../images/icon-play-btn.png';
import rew from '../../images/icon-rew-btn.png';

IconButton.propTypes = Object.assign({}, IconButtonBase.propTypes, IconButton.propTypes);
IconButton.defaultProps = Object.assign({}, IconButtonBase.defaultProps, IconButton.defaultProps);
IconButton.displayName = 'IconButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

const iconNames = Object.keys(icons);

storiesOf('IconButton')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic IconButton',
		() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				selected={boolean('selected')}
				small={boolean('small')}
				src={select('src', ['', fwd, play, rew], '')}
			>
				{select('icon', ['', ...iconNames], 'play') + text('custom icon', '')}
			</IconButton>
		)
	);
