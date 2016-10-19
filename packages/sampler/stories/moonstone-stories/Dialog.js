import Dialog, {DialogBase} from '@enact/moonstone/Dialog';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

Dialog.propTypes = Object.assign({}, DialogBase.propTypes, Dialog.propTypes);
Dialog.defaultProps = Object.assign({}, DialogBase.defaultProps, Dialog.defaultProps);

storiesOf('Dialog')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Dialog',
		() => (

			<Dialog
				open={boolean('open', true)}
				reserveClose={boolean('reserveClose', false)}
				useDivider={boolean('useDivider', false)}
			>
				<title>{text('children', 'Hello Dialog')}</title>
				<titleBelow>{text('children', 'This is an organized dialog')}</titleBelow>
				This dialog has content in it and can be very useful for organizing information
				for the user.
				<buttons>
					<Button>Ok</Button>
					<Button>Nevermind</Button>
				</buttons>
			</Dialog>
		));
