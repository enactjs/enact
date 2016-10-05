import Button, {ButtonBase} from 'enact-moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

storiesOf('Button')
	.addWithInfo(
		' ',
		'The basic Button',
		() => (
			<Button>
				QA Button
			</Button>
		)
	);
