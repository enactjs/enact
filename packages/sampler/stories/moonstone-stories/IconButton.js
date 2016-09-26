import IconButton, {IconButtonBase} from 'enact-moonstone/IconButton';
import {icons} from 'enact-moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

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
				small={boolean('small')}
			>
				{select('icon', iconNames, 'play')}
			</IconButton>
		)
	);
