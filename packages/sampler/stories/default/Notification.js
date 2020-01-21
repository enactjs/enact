import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, text} from '@enact/storybook-utils/addons/knobs';
import Button from '@enact/moonstone/Button';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Notification from '@enact/moonstone/Notification';
import Popup from '@enact/moonstone/Popup';
import React from 'react';
import {storiesOf} from '@storybook/react';

const Config = mergeComponentMetadata('Notification', Notification, Popup);

Notification.displayName = 'Notification';

storiesOf('Moonstone', module)
	.add(
		'Notification',
		() => (
			<Notification
				open={boolean('open', Config, true)}
				noAutoDismiss={boolean('noAutoDismiss', Config)}
				onClose={action('onClose')}
			>
				<span>{text('message', Config, 'Notification has content in it and can be very useful for organizing information for the user.')}</span>
				<buttons>
					<Button>Ok</Button>
					<Button>Nevermind</Button>
				</buttons>
			</Notification>
		),
		{
			info: {
				text: 'Basic usage of Notification'
			}
		}
	);
