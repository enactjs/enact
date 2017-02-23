import Button, {ButtonBase} from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['opaque', 'translucent', 'transparent']
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
				minWidth={boolean('minWidth', Button.defaultProps.minWidth)}
				preserveCase={boolean('preserveCase', Button.defaultProps.preserveCase)}
				selected={boolean('selected', Button.defaultProps.selected)}
				small={boolean('small', Button.defaultProps.small)}
			>
				{text('children', 'Click Me')}
			</Button>
		)
	);
