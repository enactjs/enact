import Button, {ButtonBase} from '@enact/moonstone/Button';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import DatePicker from '@enact/moonstone/DatePicker';
import DayPicker from '@enact/moonstone/DayPicker';
import Divider from '@enact/moonstone/Divider';
import ExpandableInput from '@enact/moonstone/ExpandableInput';
import ExpandableItem from '@enact/moonstone/ExpandableItem';
import ExpandableList from '@enact/moonstone/ExpandableList';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import IconButton from '@enact/moonstone/IconButton';
import IncrementSlider from '@enact/moonstone/IncrementSlider';
import Input from '@enact/moonstone/Input';
import Item from '@enact/moonstone/Item';
import LabeledItem from '@enact/moonstone/LabeledItem';
import Picker from '@enact/moonstone/Picker';
import Popup from '@enact/moonstone/Popup';
import RadioItem from '@enact/moonstone/RadioItem';
import SelectableItem from '@enact/moonstone/SelectableItem';
import SwitchItem from '@enact/moonstone/SwitchItem';
import TimePicker from '@enact/moonstone/TimePicker';
import ToggleButton from '@enact/moonstone/ToggleButton';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Slider from '@enact/moonstone/Slider';
import Changeable from '@enact/ui/Changeable';
import Selectable from '@enact/ui/Selectable';
import Toggleable from '@enact/ui/Toggleable';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
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
	},
	flexBox: {
		display: 'flex'
	},
	flexItem: {
		flex: '1'
	}
};

const Items = ['First', 'Second', 'Third'];
const StatefulCheckboxItem = Toggleable({prop: 'selected'}, CheckboxItem);
const StatefulDayPicker = Selectable(DayPicker);
const StatefulExpandableList = Selectable(ExpandableList);
const StatefulIncrementSlider = Changeable(IncrementSlider);
const StatefulInput = Changeable(Input);
const StatefulPicker = Changeable(Picker);
const StatefulRadioItem = Toggleable({prop: 'selected'}, RadioItem);
const StatefulSelectableItem = Toggleable({prop: 'selected'}, SelectableItem);
const StatefulSlider = Changeable(Slider);
const StatefulSwitchItem = Toggleable({prop: 'selected'}, SwitchItem);
const StatefulToggleButton = Toggleable({toggle: 'onClick', prop: 'selected'}, ToggleButton);
const StatefulToggleItem = Toggleable({prop: 'selected'}, ToggleItem);

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
						onFocus={this.startTimer}
						onSpotlightDisappear={this.resetFocus}
					>
						Focus me
					</Button>
				) : null}
				<Button
					data-component-id="restoreButton"
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
				<div style={style.flexBox}>
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
				<div style={style.flexBox}>
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
		'Directional Events',
		() => (
			<div>
				<p>
					The item below will emit onSpotlight[Direction] events when attempting
					to 5-way navigate from the item. Highlight the item below and press any of
					the 5-way directional keys to verify a matching directional event in the
					action logger.
				</p>
				<Item
					onSpotlightDown={action('onSpotlightDown')}
					onSpotlightLeft={action('onSpotlightLeft')}
					onSpotlightRight={action('onSpotlightRight')}
					onSpotlightUp={action('onSpotlightUp')}
				>
					Item
				</Item>
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
	)
	.addWithInfo(
		'Kitchen Sink',
		() => (
			<div>
				<p>
					Use the knobs to test the available behaviors for the spottable components
					below.
				</p>
				<div style={style.flexBox}>
					<div style={style.flexItem}>
						<Divider>
							Misc Components
						</Divider>
						<div style={style.flexBox}>
							<Button
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								Button
							</Button>
							<StatefulToggleButton
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								ToggleButton
							</StatefulToggleButton>
							<IconButton
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								plus
							</IconButton>
						</div>
						<div style={style.flexBox}>
							<StatefulInput
								spotlightDisabled={boolean('spotlightDisabled', false)}
							/>
						</div>
						<div style={style.flexBox}>
							<StatefulPicker
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								{Items}
							</StatefulPicker>
							<StatefulPicker
								joined
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								{Items}
							</StatefulPicker>
						</div>
						<StatefulIncrementSlider
							spotlightDisabled={boolean('spotlightDisabled', false)}
						/>
						<StatefulSlider
							spotlightDisabled={boolean('spotlightDisabled', false)}
						/>
						<Item
							spotlightDisabled={boolean('spotlightDisabled', false)}
						>
							Item
						</Item>
						<LabeledItem
							label={'Label'}
							spotlightDisabled={boolean('spotlightDisabled', false)}
						>
							LabeledItem
						</LabeledItem>
					</div>
					<div style={style.flexItem}>
						<Divider>
							Expandables
						</Divider>
						<ExpandableItem
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'Various Items in an ExpandableItem'}
						>
							<StatefulCheckboxItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								CheckboxItem
							</StatefulCheckboxItem>
							<StatefulRadioItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								RadioItem
							</StatefulRadioItem>
							<StatefulSelectableItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								SelectableItem
							</StatefulSelectableItem>
							<StatefulSwitchItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								SwitchItem
							</StatefulSwitchItem>
							<StatefulToggleItem
								icon={'plus'}
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								ToggleItem
							</StatefulToggleItem>
						</ExpandableItem>
						<StatefulExpandableList
							noLockBottom
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandableList'}
						>
							{Items}
						</StatefulExpandableList>
						<ExpandableInput
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandableInput'}
						/>
						<ExpandablePicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandablePicker'}
						>
							{Items}
						</ExpandablePicker>
						<DatePicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'DatePicker'}
						/>
						<StatefulDayPicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'DayPicker'}
						/>
						<TimePicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'TimePicker'}
						/>
					</div>
				</div>
			</div>
		)
	);
