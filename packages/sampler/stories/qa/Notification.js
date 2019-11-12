import Notification from '@enact/moonstone/Notification';
import Popup from '@enact/moonstone/Popup';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

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
// si-LK - sinhala language
const sinhala = 'සේවය නඩත්තු කිරීම හෝ වැඩි දියුණු කිරීම සඳහා කලා ගැලරිය සේවයට එකතු කිරීම, නවීකරණය කිරීම, පිවිසීම අක්‍රිය කිරීම හෝ අවසන් කිරීම යනාදිය තම පූර්ණ අභිමතය පරිදි සිදු කිරීමට LG Electronics Inc. හට හිමිකම් ඇත.කලා ගැලරිය සේවාව ලද හැකි වන්නේ ඔබ ඉහත නියමයන්ට එකඟ වුවහොත් පමණි.';

class LongButtonsSinhala extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			thirdButton: false
		};
	}
	toggleState = () => {
		this.setState(({thirdButton}) => ({thirdButton: !thirdButton}));
	}

	render () {
		return (
			<Notification open>
				<span>{sinhala}</span>
				<buttons>
					<Button onClick={this.toggleState}>Click to toggle the third button</Button>
					<Button onClick={this.toggleState}>Click to toggle the third button</Button>
					{this.state.thirdButton ? <Button onClick={this.toggleState}>Click to toggle the third button</Button> : null}
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
	)
	.add(
		'with long buttons and Sinhala',
		() => (
			<LongButtonsSinhala />
		)
	);
