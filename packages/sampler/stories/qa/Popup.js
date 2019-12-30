import Button from '@enact/moonstone/Button';
import ExpandableItem from '@enact/moonstone/ExpandableItem';
import Item from '@enact/moonstone/Item';
import Notification from '@enact/moonstone/Notification';
import {Panel} from '@enact/moonstone/Panels';
import Popup from '@enact/moonstone/Popup';
import Scroller from '@enact/moonstone/Scroller';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {action} from '../../src/utils';

Popup.displayName = 'Popup';

const Container = SpotlightContainerDecorator('div');

const PopupFromSelfOnlyContainer = Toggleable(
	{prop: 'open', toggle: 'onToggle'},
	({onToggle, open}) => (
		<div>
			<Container spotlightId="selfOnlyContainer" spotlightRestrict="self-only">
				<Button onClick={onToggle}>button</Button>
			</Container>
			<Notification open={open}>
				<span>popup</span>
				<buttons>
					<Button onClick={onToggle}>button</Button>
				</buttons>
			</Notification>
		</div>
	)
);

class PopupResumeFocusAfterOpenState extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isPopup: false
		};
	}

	handlePopup = () => {
		this.setState({
			isPopup: true
		});

		setTimeout(() => {
			this.setState({
				isPopup: false
			});
		}, 200);
	}

	render () {
		return (
			<div>
				<div>Popup will open and dismiss immediately, ensure spotlight still functional.</div>
				<Button onClick={this.handlePopup}>Open popup</Button>
				<Popup open={this.state.isPopup}>
					<Button>close</Button>
				</Popup>
			</div>
		);
	}
}

class PopupResumeFocusAfterWindowFocus extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			expandableOpen: false,
			popupOpen: false
		};

		this.nameList = ['Item 1', 'Item 2'];
	}

	componentDidMount () {
		this.blurEvent = document.createEvent('Event');
		this.blurEvent.initEvent('blur', true, true);
		this.focusEvent = document.createEvent('Event');
		this.focusEvent.initEvent('focus', true, true);
	}

	componentDidUpdate (_, prevState) {
		if (!prevState.popupOpen && this.state.popupOpen) {
			setTimeout(this.doJob, 1000);
		}
	}

	handleItemClick = () => {
		this.openPopup();
	}

	openPopup = () => {
		this.setState({
			popupOpen: true,
			expandableOpen: false
		});
	}

	closePopup = () => {
		this.setState({
			popupOpen: false
		});
	}

	doJob = () => {
		window.dispatchEvent(this.blurEvent);
		window.dispatchEvent(this.focusEvent);
	}

	handleExpandableOpen = () => {
		this.setState({expandableOpen: true});
	}

	handleExpandableClose = () => {
		this.setState({expandableOpen: false});
	}

	render () {
		return (
			<Panel>
				<Scroller>
					<ExpandableItem
						title="ExpandableItem Title"
						label="ExpandableItem Label"
						open={this.state.expandableOpen}
						onOpen={this.handleExpandableOpen}
						onClose={this.handleExpandableClose}
					>
						{
							this.nameList.map((value, index) => (
								<Item key={index} onClick={this.handleItemClick}>{value}</Item>)
							)
						}
					</ExpandableItem>
				</Scroller>
				<Popup open={this.state.popupOpen} noAnimation showCloseButton>
					<Button onClick={this.closePopup}>Close Popup</Button>
				</Popup>
			</Panel>
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
	)
	.add(
		'from self-only container',
		() => (
			<PopupFromSelfOnlyContainer />
		)
	)
	.add(
		'resume focus after open state',
		() => (
			<PopupResumeFocusAfterOpenState />
		)
	)
	.add(
		'resume focus after window focus',
		() => (
			<PopupResumeFocusAfterWindowFocus />
		)
	);
