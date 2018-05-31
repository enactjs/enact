import Dialog from '@enact/moonstone/Dialog';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

Dialog.displayName = 'Dialog';

storiesOf('Moonstone', module)
	.add(
		'Dialog',
		withInfo({
			propTablesExclude: [BodyText, Button, Dialog],
			text: 'Basic usage of Dialog'
		})(() => (
			<div>
				<Dialog
					casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					noDivider={boolean('noDivider', false)}
					onClose={action('onClose')}
					open={boolean('open', false)}
					showCloseButton={boolean('showCloseButton', false)}
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
		))
	);
