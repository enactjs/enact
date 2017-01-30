import Button, {ButtonBase} from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import Popup from '@enact/moonstone/Popup';
import Spotlight, {SpotlightContainerDecorator} from '@enact/spotlight';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

const Container = SpotlightContainerDecorator('div');
const style = {
	container: {
		width: '300px',
		border: '1px dashed red',
		margin: '0 12px',
		padding: '12px'
	}
};

class DisappearTest extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			showButton: true
		};
	}

	componentWillUnmount () {
		this.stopTimer();
	}

	removeButton = () => {
		this.setState({showButton: false});
	}

	restoreButton = () => {
		this.setState({showButton: true});
	}

	resetFocus = () => {
		Spotlight.focus('[data-component-id="restoreButton"]');
	}

	startTimer = () => {
		this.timer = window.setTimeout(this.removeButton, 4000);
	}

	stopTimer = () => {
		if (this.timer) {
			window.clearTimeout(this.timer);
		}
	}

	render () {
		return (
			<div>
				5-way select to set focus to the Focus Me button and wait until 4s has elapsed, and observe the focused
				button is removed and the remaining button gains focus.
				{this.state.showButton ? (
					<Button
						onBlur={this.stopTimer}
						onFocus={this.startTimer}
						onSpotlightDisappear={this.resetFocus}
					>
						Focus me
					</Button>
				) : null}
				<Button
					data-component-id='restoreButton'
					onClick={this.restoreButton}
				>
					Restore Button
				</Button>
			</div>
		);
	}
}

class PopupFocusTest extends React.Component {
	static propTypes = {
		noAnimation: React.PropTypes.bool,
		noAutoDismiss: React.PropTypes.bool,
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent', 'none']),
		spotlightRestrict: React.PropTypes.oneOf(['none', 'self-first', 'self-only'])
	}

	static defaultProps = {
		noAnimation: false,
		noAutoDismiss: false,
		scrimType: 'translucent',
		spotlightRestrict: 'self-only'
	}

	constructor (props) {
		super(props);
		this.state = {
			popupOpen: false
		};
	}

	handleClosePopup = () => {
		this.setState({popupOpen: false});
	}

	handleOpenPopup = () => {
		this.setState({popupOpen: true});
	}

	render () {
		const {noAnimation, noAutoDismiss, scrimType, spotlightRestrict} = this.props;

		return (
			<div>
				<p>
					Open the popup by using 5-way selection on the &quot;Open Popup&quot; buttons.
					When the popup is visible, select the popup&apos;s close button to close the popup.
					Focus should return to the button used to originally open the popup. Verify this
					behavior for each of the buttons.
				</p>
				<Button onClick={this.handleOpenPopup}>Open Popup</Button>
				<Button onClick={this.handleOpenPopup}>Open Popup</Button>
				<Popup
					noAnimation={noAnimation}
					noAutoDismiss={noAutoDismiss}
					onClose={this.handleClosePopup}
					open={this.state.popupOpen}
					scrimType={scrimType}
					showCloseButton
					spotlightRestrict={spotlightRestrict}
				>
					<div>This is a Popup</div>
				</Popup>
			</div>
		);
	}
}

storiesOf('Spotlight')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Multiple Buttons',
		() => (
			<div>
				<Button onClick={action('onClick')}>
					One
				</Button>
				<Button onClick={action('onClick')}>
					Two
				</Button>
				<Button onClick={action('onClick')}>
					Three
				</Button>
			</div>
		)
	)
	.addWithInfo(
		'Multiple Containers',
		() => (
			<div>
				<p>
					The containers below will spot the last-focused element. Keep track of the
					last-focused element in the container when testing and ensure that the correct
					element is spotted when re-entering the container with 5-way. If the pointer is
					inside a container and a 5-way directional key is pressed, the nearest element
					to the pointer (in the direction specified by the key) will be spotted.
				</p>
				<div style={{display: 'flex'}}>
					<Container style={style.container}>
						<Item>1</Item>
						<Item>2</Item>
						<Item>3</Item>
						<div>Non-spottable content 1</div>
						<div>Non-spottable content 2</div>
						<div>Non-spottable content 3</div>
					</Container>
					<Container style={style.container}>
						<div>Non-spottable content A</div>
						<div>Non-spottable content B</div>
						<div>Non-spottable content C</div>
						<Item>A</Item>
						<Item>B</Item>
						<Item>C</Item>
					</Container>
				</div>
			</div>
		)
	)
	.addWithInfo(
		'Muted Containers',
		() => (
			<div>
				<p>
					The container below will be muted. The items within the container can gain
					focus, but they should not have a typical spotlight highlight. Instead, they
					should appear as though they do not have focus and they should not generate
					onFocus or onBlur events in the action logger.
				</p>
				<div style={{display: 'flex'}}>
					<Container style={style.container} spotlightMuted>
						<Item onFocus={action('onFocus')} onBlur={action('onBlur')}>1</Item>
						<Item onFocus={action('onFocus')} onBlur={action('onBlur')}>2</Item>
						<Item onFocus={action('onFocus')} onBlur={action('onBlur')}>3</Item>
					</Container>
				</div>
			</div>
		)
	)
	.addWithInfo(
		'Disappearing Spottable',
		() => (
			<DisappearTest />
		)
	)
	.addWithInfo(
		'Popup Focus Targets',
		() => (
			<PopupFocusTest
				noAnimation={boolean('noAnimation', false)}
				noAutoDismiss={boolean('noAutoDismiss', false)}
				scrimType={select('scrimType', ['none', 'transparent', 'translucent'], 'translucent')}
				spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}
			/>
		)
	);
