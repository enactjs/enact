import Button, {ButtonBase} from '@enact/moonstone/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';
import nullify from '../../src/utils/nullify.js';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['opaque', 'translucent', 'transparent'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Button')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Button',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled', Button.defaultProps.disabled)}
				icon={nullify(select('icon', prop.icons))}
				minWidth={boolean('minWidth', Button.defaultProps.minWidth)}
				preserveCase={boolean('preserveCase', Button.defaultProps.preserveCase)}
				selected={boolean('selected', Button.defaultProps.selected)}
				small={boolean('small', Button.defaultProps.small)}
			>
				{text('children', 'Click Me')}
			</Button>
		)
	);
