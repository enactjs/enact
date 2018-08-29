import Button from '@enact/moonstone/Button';
import Popup from '@enact/moonstone/Popup';
import React from 'react';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Spotlight from '@enact/spotlight';
import Notification from '@enact/moonstone/Notification';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';

Popup.displayName = 'Popup';

const Container = SpotlightContainerDecorator('div');

class PopupFromSelfOnlyContainer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isPopup: false
		};
	}

	componentDidMount = () => {
		Spotlight.set('selfOnlyContainer', {'restrict': 'self-only'});
	}

	openPopup = () => {
		this.setState({isPopup: true});
	}

	closePopup = () => {
		this.setState({isPopup: false});
	}

	render () {
		return (
			<div>
				<Container spotlightId='selfOnlyContainer'>
					<Button onClick={this.openPopup}>button</Button>
				</Container>
				<Notification open={this.state.isPopup}>
					<span>popup</span>
					<buttons>
						<Button onClick={this.closePopup}>button</Button>
					</buttons>
				</Notification>
			</div>
		);
	}
}

storiesOf('Popup', module)
	.add(
		'using spotlightRestrict',
		() => (
			<div>
				<p>
					The contents of the popup below should contain the only controls that can be
					navigated to using 5-way. This is because the popup is using a `spotlightRestrict`
					value of `self-only`. If the value changes to `self-first`, the other panel controls
					can receive focus, but priority will be given to controls within the popup first.
				</p>
				<Button>Button</Button>
				<Popup
					open={boolean('open', Popup, true)}
					noAnimation={boolean('noAnimation', Popup, false)}
					noAutoDismiss={boolean('noAutoDismiss', Popup, false)}
					onClose={action('onClose')}
					showCloseButton={boolean('showCloseButton', Popup, true)}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], Popup, 'self-only')}
				>
					<div>{text('children', Popup, 'Hello Popup')}</div>
					<br />
					<Container>
						<Button>Button</Button>
						<Button>Button</Button>
						<Button>Button</Button>
					</Container>
				</Popup>
			</div>
		)
	).add(
		'from self-only container',
		() => (
			<PopupFromSelfOnlyContainer />
		)
	);
