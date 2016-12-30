import Dialog, {DialogBase} from '@enact/moonstone/Dialog';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

Dialog.propTypes = Object.assign({}, DialogBase.propTypes, Dialog.propTypes);
Dialog.defaultProps = Object.assign({}, DialogBase.defaultProps, Dialog.defaultProps);
Dialog.displayName = 'Dialog';

storiesOf('Dialog')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Dialog',
		() => (
			<Dialog
				open={boolean('open', true)}
				noAnimation={boolean('noAnimation', false)}
				noAutoDismiss={boolean('noAutoDismiss', false)}
				onClose={action('onClose')}
				showCloseButton={boolean('showCloseButton', false)}
				preserveCase={boolean('preserveCase', false)}
				showDivider={boolean('showDivider', false)}
			>
				<title>{text('title', 'Hello Dialog')}</title>
				<titleBelow>{text('titleBelow', 'This is an organized dialog')}</titleBelow>
				<span>This dialog has content in it and can be very useful for organizing information
				for the user.</span>
				<buttons>
					<Button>Ok</Button>
					<Button>Nevermind</Button>
				</buttons>
			</Dialog>
		));
