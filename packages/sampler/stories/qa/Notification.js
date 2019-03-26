import Notification from '@enact/moonstone/Notification';
import Popup from '@enact/moonstone/Popup';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Notification', Notification, Popup);

Notification.displayName = 'Notification';

class StatefulNotification extends React.Component {
	constructor (props) {
		super(props);

		this.messageFiller = '0123456789abcdefghijklmnopqrstuvwxyz';
		this.messageArray = [this.messageFiller];

		this.state = {
			message: this.parseMessage()
		};
	}

	addToMessage = () => {
		this.messageArray.push(this.messageFiller);
		this.setState({message: this.parseMessage()});
	}

	parseMessage = () => this.messageArray.join(' ')

	removeFromMessage = () => {
		this.messageArray.pop();
		this.setState({message: this.parseMessage()});
	}

	render () {
		const {message} = this.state;
		return (
			<Notification
				open={boolean('open', Config, true)}
				noAutoDismiss={boolean('noAutoDismiss', Config)}
				onClose={action('onClose')}
			>
				<span>{message}</span>
				<buttons>
					<Button onClick={this.addToMessage}>Add a Line</Button>
					<Button onClick={this.removeFromMessage}>Remove a Line</Button>
				</buttons>
			</Notification>
		);
	}
}

storiesOf('Notification', module)
	.add(
		'with dynamic content',
		() => (
			<StatefulNotification />
		)
	);
