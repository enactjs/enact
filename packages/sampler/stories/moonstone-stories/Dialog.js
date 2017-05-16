import Dialog from '@enact/moonstone/Dialog';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

storiesOf('Dialog')
	.addWithInfo(
		' ',
		'Basic usage of Dialog',
		() => (
			<div>
				<Dialog
					casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					onClose={action('onClose')}
					open={boolean('open', false)}
					showCloseButton={boolean('showCloseButton', false)}
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
				<BodyText centered>Use KNOBS to interact with Dialog.</BodyText>
			</div>
		)
	);
