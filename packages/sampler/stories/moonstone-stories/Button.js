import Button, {ButtonBase} from '@enact/moonstone/Button';
import IconButton from '@enact/moonstone/IconButton';
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
		() => (<div>
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				color={select('color', [null, 'red', 'green', 'yellow', 'blue'])}
				disabled={boolean('disabled', Button.defaultProps.disabled)}
				minWidth={boolean('minWidth', Button.defaultProps.minWidth)}
				preserveCase={boolean('preserveCase', Button.defaultProps.preserveCase)}
				selected={boolean('selected', Button.defaultProps.selected)}
				small={boolean('small', Button.defaultProps.small)}
			>
				{text('children', 'Click Me')}
			</Button>
			<div style={{marginTop: '1em'}}>
				<Button>star</Button>
				<Button color="red">denselist</Button>
				<Button color="green" disabled>trash</Button>
				<Button color="yellow" small>star</Button>
				<Button color="blue" small disabled>lock</Button>
			</div>
			<div style={{marginTop: '1em'}}>
				<IconButton>star</IconButton>
				<IconButton color="red" small>denselist</IconButton>
				<IconButton color="green" small disabled>trash</IconButton>
				<IconButton color="yellow">star</IconButton>
				<IconButton color="blue" disabled>lock</IconButton>
			</div>
		</div>)
	);