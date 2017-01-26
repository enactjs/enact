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
		'Kitchen Sink',
		() => (
			<div>
				<p>
					Use the knobs to test the available behaviors for the spottable components
					below. Note that changes for certain components won&apos;t take effect
					until the sample has been reloaded.
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
							<ToggleButton
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								ToggleButton
							</ToggleButton>
							<IconButton
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								plus
							</IconButton>
						</div>
						<div style={style.flexBox}>
							<Input
								spotlightDisabled={boolean('spotlightDisabled', false)}
							/>
						</div>
						<div style={style.flexBox}>
							<Picker
								spotlightDisabled={boolean('spotlightDisabled', false)}
								value={1}
							>
								{['First', 'Second', 'Third']}
							</Picker>
							<Picker
								joined
								spotlightDisabled={boolean('spotlightDisabled', false)}
								value={1}
							>
								{['First', 'Second', 'Third']}
							</Picker>
						</div>
						<IncrementSlider
							spotlightDisabled={boolean('spotlightDisabled', false)}
							value={50}
						/>
						<Slider
							spotlightDisabled={boolean('spotlightDisabled', false)}
							value={50}
						/>
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
							<Item
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								Item
							</Item>
							<CheckboxItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								CheckboxItem
							</CheckboxItem>
							<RadioItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								RadioItem
							</RadioItem>
							<SelectableItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								SelectableItem
							</SelectableItem>
							<SwitchItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								SwitchItem
							</SwitchItem>
							<ToggleItem
								spotlightDisabled={boolean('spotlightDisabled', false)}
							>
								ToggleItem
							</ToggleItem>
						</ExpandableItem>
						<ExpandableList
							noLockBottom
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandableList'}
						>
							{['First', 'Second', 'Third']}
						</ExpandableList>
						<ExpandableInput
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandableInput'}
						/>
						<ExpandablePicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'ExpandablePicker'}
							value={1}
						>
							{['💥 boom', '😩🖐 facepalm', '🍩 doughnut']}
						</ExpandablePicker>
						<DatePicker
							spotlightDisabled={boolean('spotlightDisabled', false)}
							title={'DatePicker'}
						/>
						<DayPicker
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
