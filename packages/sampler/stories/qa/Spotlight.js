import Button from '@enact/moonstone/Button';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import DatePicker from '@enact/moonstone/DatePicker';
import DayPicker from '@enact/moonstone/DayPicker';
import Divider from '@enact/moonstone/Divider';
import ExpandableInput from '@enact/moonstone/ExpandableInput';
import ExpandableItem from '@enact/moonstone/ExpandableItem';
import ExpandableList from '@enact/moonstone/ExpandableList';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import Icon from '@enact/moonstone/Icon';
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
import Scroller from '@enact/moonstone/Scroller';
import Slider from '@enact/moonstone/Slider';
import Spotlight from '@enact/spotlight';
import {Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import docs from '../../images/icon-enact-docs.png';
import {boolean, select} from '../../src/enact-knobs';
import Pause from '@enact/spotlight/Pause';

const Container = SpotlightContainerDecorator(
	{enterTo: 'last-focused'},
	'div'
);

const style = {
	container: () => ({
		width: ri.unit(300, 'rem'),
		border: '1px dashed red',
		margin: '0 ' + ri.unit(12, 'rem'),
		padding: ri.unit(12, 'rem')
	}),
	fittedContainer: () => ({
		border: '1px dashed blue',
		margin: '0 ' + ri.unit(12, 'rem'),
		padding: ri.unit(12, 'rem')
	}),
	flexBox: {
		display: 'flex'
	},
	flexItem: {
		flex: '1'
	}
};

const Items = ['First', 'Second', 'Third'];

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
		Spotlight.focus('restoreButton');
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
					spotlightId="restoreButton"
					onClick={this.restoreButton}
				>
					Restore Button
				</Button>
			</div>
		);
	}
}

class DisableTest extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			disabled: false
		};
	}

	componentDidMount () {
		Spotlight.resume();
		this.id = setInterval(() => this.setState(state => ({disabled: !state.disabled})), 5000);
	}

	componentWillUnmount () {
		clearInterval(this.id);
		this.paused.resume();
	}

	paused = new Pause('Pause Test')

	handleToggle = () => {
		if (this.paused.isPaused()) {
			this.paused.resume();
		} else {
			this.paused.pause();
		}
	}

	render () {
		return (
			<div>
				<p>Timed Button is alternately enabled and disabled every 5 seconds. Pressing the Active/Paused button will resume and pause Spotlight, respectively.</p>
				<Button disabled={this.state.disabled}>
					Timed Button
				</Button>
				<ToggleButton
					defaultSelected
					toggleOnLabel="Active"
					toggleOffLabel="Paused"
					onToggle={this.handleToggle}
				/>
			</div>
		);
	}
}

class PopupFocusTest extends React.Component {
	static propTypes = {
		noAnimation: PropTypes.bool,
		noAutoDismiss: PropTypes.bool,
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),
		showCloseButton: PropTypes.bool,
		spotlightRestrict: PropTypes.oneOf(['self-first', 'self-only'])
	}

	static defaultProps = {
		noAnimation: false,
		noAutoDismiss: false,
		scrimType: 'translucent',
		showCloseButton: false,
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
		const {noAnimation, noAutoDismiss, scrimType, showCloseButton, spotlightRestrict} = this.props;

		return (
			<div>
				<p>
					Open the popup by using 5-way selection on the &quot;Open Popup&quot; buttons.
					When the popup is visible, select the popup&apos;s close button to close the popup.
					Focus should return to the button used to originally open the popup. Verify this
					behavior for each of the buttons.
				</p>
				<p>
					Use the knobs to verify 5-way behavior under different Popup configurations.
				</p>
				<Button onClick={this.handleOpenPopup}>Open Popup</Button>
				<Button onClick={this.handleOpenPopup}>Open Popup</Button>
				<Popup
					noAnimation={noAnimation}
					noAutoDismiss={noAutoDismiss}
					onClose={this.handleClosePopup}
					open={this.state.popupOpen}
					scrimType={scrimType}
					showCloseButton={showCloseButton}
					spotlightRestrict={spotlightRestrict}
				>
					<div>This is a Popup</div>
				</Popup>
			</div>
		);
	}
}

class FocusedAndDisabled extends React.Component {
	state = {
		index: -1
	}

	tests = [
		<Button icon="star">Button</Button>,
		<IconButton>star</IconButton>,
		<Button icon={docs}>Button</Button>,
		<IconButton>{docs}</IconButton>
	]

	handleClear = () => this.setState({index: -1})

	select = (index) => {
		Spotlight.setPointerMode(false);
		Spotlight.focus(`component-${index}`);
		this.setState({index});
	}

	render () {
		return (
			<Scroller>
				<p>Click or 5-way select the icon buttons to:</p>
				<ol>
					<li>Disable pointer mode</li>
					<li>Set focus on the component next to the button</li>
					<li>Disable the newly focused component</li>
				</ol>
				<Button onClick={this.handleClear}>Enable All</Button>
				{this.tests.map((comp, index) => (
					<Row key={`row-${index}`}>
						{/* eslint-disable-next-line react/jsx-no-bind */}
						<IconButton onTap={() => this.select(index)}>
							arrowlargeright
						</IconButton>
						{React.cloneElement(comp, {
							disabled: this.state.index === index,
							spotlightId: `component-${index}`
						})}
					</Row>
				))}
			</Scroller>
		);
	}
}

storiesOf('Spotlight', module)
	.add(
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
	.add(
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
					<Container style={style.container()}>
						<Item>1</Item>
						<Item>2</Item>
						<Item>3</Item>
						<div>Non-spottable content 1</div>
						<div>Non-spottable content 2</div>
						<div>Non-spottable content 3</div>
					</Container>
					<Container style={style.container()}>
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
	.add(
		'Nested Containers',
		() => (
			<div>
				<p>
					The nested containers below both use a enterTo: &apos;last-focused&apos; configuration.
					You should be able to naturally 5-way navigate between the items in the containers. Also,
					attempting to 5-way navigate (left or down) from the application close button should
					result in the last-focused item being spotted.
				</p>
				<div style={style.flexBox}>
					<Container style={style.fittedContainer()} >
						<Item>Item in a container</Item>
						<Container style={style.fittedContainer()} >
							<Item>Item in a nested container</Item>
						</Container>
					</Container>
				</div>
			</div>
		)
	)
	.add(
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
	.add(
		'Disappearing Spottable',
		() => (
			<DisappearTest />
		)
	)
	.add(
		'Disabled with Pause',
		() => (
			<DisableTest />
		)
	)
	.add(
		'Popup Navigation',
		() => (
			<PopupFocusTest
				noAnimation={boolean('noAnimation', PopupFocusTest, false)}
				noAutoDismiss={boolean('noAutoDismiss', PopupFocusTest, false)}
				scrimType={select('scrimType', ['none', 'transparent', 'translucent'], PopupFocusTest, 'translucent')}
				showCloseButton={boolean('showCloseButton', PopupFocusTest, true)}
				spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], PopupFocusTest, 'self-only')}
			/>
		)
	)
	.add(
		'Focused and Disabled',
		() => (
			<FocusedAndDisabled />
		)
	)
	.add(
		'Navigating into overflow containers',
		() => (
			<div>
				<Item>Before last-focused Container + Scroller</Item>
				<Container style={{outline: '1px dotted #ffffff80'}}>
					<Scroller>
						<ExpandableItem disabled title="Expandable Item">
							<Button>Hiding!</Button>
						</ExpandableItem>
						<Item>Item A</Item>
						<Item disabled>Item B</Item>
						<Item>Item C</Item>
						<ExpandableItem disabled title="Expandable Item">
							<Button>Hiding!</Button>
						</ExpandableItem>
					</Scroller>
				</Container>
				<Item>After last-focused Container + Scroller</Item>
			</div>
		)
	)
	.add(
		'Kitchen Sink',
		() => (
			<div>
				<p>
					Use the knobs to test the available behaviors for the spottable components
					below.
				</p>
				<Container style={style.flexBox} spotlightMuted={boolean('spotlightMuted', Container, false)}>
					<div style={style.flexItem}>
						<Divider>
							Misc Components
						</Divider>
						<div style={style.flexBox}>
							<Button
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								Button
							</Button>
							<Button
								backgroundOpacity="translucent"
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								Translucent
							</Button>
						</div>
						<div style={style.flexBox}>
							<Button
								backgroundOpacity="transparent"
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								Transparent
							</Button>
							<ToggleButton
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								ToggleButton
							</ToggleButton>
						</div>
						<div style={style.flexBox}>
							<IconButton
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								plus
							</IconButton>
							<Input
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							/>
						</div>
						<div style={style.flexBox}>
							<Picker
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								{Items}
							</Picker>
							<Picker
								joined
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
							>
								{Items}
							</Picker>
						</div>
						<IncrementSlider
							onSpotlightDown={action('onSpotlightDown')}
							onSpotlightLeft={action('onSpotlightLeft')}
							onSpotlightRight={action('onSpotlightRight')}
							onSpotlightUp={action('onSpotlightUp')}
							spotlightDisabled={boolean('spotlightDisabled', Container, false)}
						/>
						<Slider
							onSpotlightDown={action('onSpotlightDown')}
							onSpotlightLeft={action('onSpotlightLeft')}
							onSpotlightRight={action('onSpotlightRight')}
							onSpotlightUp={action('onSpotlightUp')}
							spotlightDisabled={boolean('spotlightDisabled', Container, false)}
						/>
						<Item
							onSpotlightDown={action('onSpotlightDown')}
							onSpotlightLeft={action('onSpotlightLeft')}
							onSpotlightRight={action('onSpotlightRight')}
							onSpotlightUp={action('onSpotlightUp')}
							spotlightDisabled={boolean('spotlightDisabled', Container, false)}
						>
							Item
						</Item>
						<LabeledItem
							label="Label"
							onSpotlightDown={action('onSpotlightDown')}
							onSpotlightLeft={action('onSpotlightLeft')}
							onSpotlightRight={action('onSpotlightRight')}
							onSpotlightUp={action('onSpotlightUp')}
							spotlightDisabled={boolean('spotlightDisabled', Container, false)}
						>
							LabeledItem
						</LabeledItem>
					</div>
					<div style={style.flexItem}>
						<Divider>
							Expandables
						</Divider>
						<Scroller style={{height: '500px'}}>
							<ExpandableItem
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="Various Items in an ExpandableItem"
							>
								<CheckboxItem
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									CheckboxItem
								</CheckboxItem>
								<FormCheckboxItem
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									FormCheckboxItem
								</FormCheckboxItem>
								<RadioItem
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									RadioItem
								</RadioItem>
								<SelectableItem
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									SelectableItem
								</SelectableItem>
								<SwitchItem
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									SwitchItem
								</SwitchItem>
								<ToggleItem
									icon="plus"
									iconComponent={Icon}
									onSpotlightDown={action('onSpotlightDown')}
									onSpotlightLeft={action('onSpotlightLeft')}
									onSpotlightRight={action('onSpotlightRight')}
									onSpotlightUp={action('onSpotlightUp')}
									spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								>
									ToggleItem
								</ToggleItem>
							</ExpandableItem>
							<ExpandableList
								noLockBottom
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="ExpandableList"
							>
								{Items}
							</ExpandableList>
							<ExpandableInput
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="ExpandableInput"
							/>
							<ExpandablePicker
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="ExpandablePicker"
							>
								{Items}
							</ExpandablePicker>
							<DatePicker
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="DatePicker"
							/>
							<DayPicker
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="DayPicker"
							/>
							<TimePicker
								onSpotlightDown={action('onSpotlightDown')}
								onSpotlightLeft={action('onSpotlightLeft')}
								onSpotlightRight={action('onSpotlightRight')}
								onSpotlightUp={action('onSpotlightUp')}
								spotlightDisabled={boolean('spotlightDisabled', Container, false)}
								title="TimePicker"
							/>
						</Scroller>
					</div>
				</Container>
			</div>
		)
	);
