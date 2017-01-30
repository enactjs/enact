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
import Spotlight, {SpotlightContainerDecorator} from '@enact/spotlight';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

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
const StatefulInput = Changeable(Input);
const StatefulPicker = Changeable(Picker);
const StatefulRadioItem = Toggleable({prop: 'selected'}, RadioItem);
const StatefulSelectableItem = Toggleable({prop: 'selected'}, SelectableItem);
const StatefulSwitchItem = Toggleable({prop: 'selected'}, SwitchItem);
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

class KitchenSinkTest extends React.Component {
	static propTypes = {
		spotlightDisabled: React.PropTypes.bool
	}

	static defaultProps = {
		spotlightDisabled: false
	}

	render () {
		const {spotlightDisabled} = this.props;

		return (
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
								spotlightDisabled={spotlightDisabled}
							>
								Button
							</Button>
							<ToggleButton
								spotlightDisabled={spotlightDisabled}
							>
								ToggleButton
							</ToggleButton>
							<IconButton
								spotlightDisabled={spotlightDisabled}
							>
								plus
							</IconButton>
						</div>
						<div style={style.flexBox}>
							<StatefulInput
								spotlightDisabled={spotlightDisabled}
							/>
						</div>
						<div style={style.flexBox}>
							<StatefulPicker
								spotlightDisabled={spotlightDisabled}
							>
								{Items}
							</StatefulPicker>
							<StatefulPicker
								joined
								spotlightDisabled={spotlightDisabled}
							>
								{Items}
							</StatefulPicker>
						</div>
						<IncrementSlider
							spotlightDisabled={spotlightDisabled}
							value={50}
						/>
						<Slider
							spotlightDisabled={spotlightDisabled}
							value={50}
						/>
						<Item
							spotlightDisabled={spotlightDisabled}
						>
							Item
						</Item>
						<LabeledItem
							label={'Label'}
							spotlightDisabled={spotlightDisabled}
						>
							LabeledItem
						</LabeledItem>
					</div>
					<div style={style.flexItem}>
						<Divider>
							Expandables
						</Divider>
						<ExpandableItem
							spotlightDisabled={spotlightDisabled}
							title={'Various Items in an ExpandableItem'}
						>
							<StatefulCheckboxItem
								spotlightDisabled={spotlightDisabled}
							>
								CheckboxItem
							</StatefulCheckboxItem>
							<StatefulRadioItem
								spotlightDisabled={spotlightDisabled}
							>
								RadioItem
							</StatefulRadioItem>
							<StatefulSelectableItem
								spotlightDisabled={spotlightDisabled}
							>
								SelectableItem
							</StatefulSelectableItem>
							<StatefulSwitchItem
								spotlightDisabled={spotlightDisabled}
							>
								SwitchItem
							</StatefulSwitchItem>
							<StatefulToggleItem
								icon={'plus'}
								spotlightDisabled={spotlightDisabled}
							>
								ToggleItem
							</StatefulToggleItem>
						</ExpandableItem>
						<StatefulExpandableList
							noLockBottom
							spotlightDisabled={spotlightDisabled}
							title={'ExpandableList'}
						>
							{Items}
						</StatefulExpandableList>
						<ExpandableInput
							spotlightDisabled={spotlightDisabled}
							title={'ExpandableInput'}
						/>
						<ExpandablePicker
							spotlightDisabled={spotlightDisabled}
							title={'ExpandablePicker'}
						>
							{Items}
						</ExpandablePicker>
						<DatePicker
							spotlightDisabled={spotlightDisabled}
							title={'DatePicker'}
						/>
						<StatefulDayPicker
							spotlightDisabled={spotlightDisabled}
							title={'DayPicker'}
						/>
						<TimePicker
							spotlightDisabled={spotlightDisabled}
							title={'TimePicker'}
						/>
					</div>
				</div>
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
		'Kitchen Sink',
		() => (
			<KitchenSinkTest spotlightDisabled={boolean('spotlightDisabled', false)} />
		)
	);
