import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import Button, {ButtonBase} from 'enact-moonstone/Button';

const buttonStories = storiesOf('Button').addDecorator(withKnobs);

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

buttonStories
	.addWithInfo(
		'',
		'The basic Button.',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				preserveCase={boolean('preserveCase')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				Click Me
			</Button>
		)
	);
