import Notification, {NotificationBase} from '@enact/moonstone/Notification';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Notification', NotificationBase, Notification);

storiesOf('Notification')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Notification',
		() => (
			<Notification
				disabled={nullify(boolean('disabled', false))}
				noAutoDismiss={boolean('noAutoDismiss', false)}
				onClose={action('onClose')}
				open={boolean('open', true)}
			>
				<span>{text('message', 'Notification has content in it and can be very useful for organizing information for the user.')}</span>
				<buttons>
					<Button>Ok</Button>
					<Button>Nevermind</Button>
				</buttons>
			</Notification>
		),
		{propTables: [Config]}
	);
