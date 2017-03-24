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
				color={select('color', [null, 'red', 'green', 'yellow', 'blue'])}
				disabled={boolean('disabled', false)}
				selected={boolean('selected', false)}
				small={boolean('small', false)}
			>
				{select('src', ['', fwd, play, rew], '') + select('icon', ['', ...iconNames], 'plus') + text('custom icon', '')}
			</IconButton>
		)
	);
