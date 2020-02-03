import {action} from '@enact/storybook-utils/addons/actions';
import BodyText from '@enact/moonstone/BodyText';
import {boolean, text} from '@enact/storybook-utils/addons/knobs';
import Button from '@enact/moonstone/Button';
import Dialog from '@enact/moonstone/Dialog';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Popup from '@enact/moonstone/Popup';
import React from 'react';
import {storiesOf} from '@storybook/react';

const Config = mergeComponentMetadata('Dialog', Popup, Dialog);
Dialog.displayName = 'Dialog';

storiesOf('Moonstone', module)
	.add(
		'Dialog',
		() => (
			<div>
				<Dialog
					// null issue
					noAnimation={boolean('noAnimation', Config)}
					// null issue
					noAutoDismiss={boolean('noAutoDismiss', Config)}
					// null issue
					noDivider={boolean('noDivider', Config)}
					onClose={action('onClose')}
					// null issue
					open={boolean('open', Config)}
					showCloseButton={boolean('showCloseButton', Config)}
				>
					<title>{text('title', Config, 'Hello Dialog')}</title>
					<titleBelow>{text('titleBelow', Config, 'This is an organized dialog')}</titleBelow>
					<span>This dialog has content in it and can be very useful for organizing information
							for the user. This dialog has content in it and can be very useful for organizing information
							for the user.</span>
					<buttons>
						<Button>Ok</Button>
						<Button>Nevermind</Button>
					</buttons>
				</Dialog>
				<BodyText centered>Use KNOBS to interact with Dialog.</BodyText>
			</div>
		),
		{
			info: {
				text: 'Basic usage of Dialog'
			}
		}
	);
