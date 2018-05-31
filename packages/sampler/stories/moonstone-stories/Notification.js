import Notification from '@enact/moonstone/Notification';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

Notification.displayName = 'Notification';

storiesOf('Moonstone', module)
	.add(
		'Notification',
		withInfo({
			propTablesExclude: [Button, Notification],
			text: 'Basic usage of Notification'
		})(() => (
			<Notification
				open={boolean('open', true)}
				noAutoDismiss={boolean('noAutoDismiss', false)}
				onClose={action('onClose')}
			>
				<span>{text('message', 'Notification has content in it and can be very useful for organizing information for the user.')}</span>
				<buttons>
					<Button>Ok</Button>
					<Button>Nevermind</Button>
				</buttons>
			</Notification>
		))
	);
