import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import IconButton, {IconButtonBase} from 'enact-moonstone/IconButton';
import IconList from 'enact-moonstone/Icon/IconList';

const buttonStories = storiesOf('IconButton').addDecorator(withKnobs);

IconButton.propTypes = Object.assign({}, IconButtonBase.propTypes, IconButton.propTypes);
IconButton.defaultProps = Object.assign({}, IconButtonBase.defaultProps, IconButton.defaultProps);
IconButton.displayName = 'IconButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

const icons = Object.keys(IconList);

buttonStories
	.addWithInfo(
		'',
		'The basic IconButton.',
		() => (
			<IconButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				small={boolean('small')}
			>
				{select('icon', icons, 'play')}
			</IconButton>
		)
	);
