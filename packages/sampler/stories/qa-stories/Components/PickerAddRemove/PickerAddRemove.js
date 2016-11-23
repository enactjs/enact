import React from 'react';

import {Picker} from '@enact/moonstone/Picker';
import {Input} from '@enact/moonstone/Input';
import Button from '@enact/moonstone/Button';
import Changeable from '@enact/ui/Changeable';

const StatefulPicker = Changeable(Picker);
const StatefulInput = Changeable({mutable: true}, Input);

class PickerAddRemove extends React.Component {
	static displayName: 'PickerAddRemove'

	static propTypes = {
		disabled: React.PropTypes.bool,
		joined: React.PropTypes.bool,
		noAnimation: React.PropTypes.bool,
		orientation: React.PropTypes.string,
		width: React.PropTypes.string,
		wrap: React.PropTypes.bool
	}

	static defaultProps = {
		disabled: false,
		joined: false,
		noAnimation: false,
		orientation: 'horizontal',
		width: 'medium',
		wrap: false
	}

	constructor (props) {
		super(props);
		this.state = {
			children: props.children
		};
	}

	handleAdd = () => {
		const component = this.addInput;
		this.setState({
			children: [
				...this.state.children,
				component.state.value
			]
		});
	}

	handleRemove = () => {
		const component = this.removeInput;
		this.setState({
			children: [
				...this.state.children.slice(0, component.state.value),
				...this.state.children.slice(component.state.value + 1)
			]
		});
	}

	render () {
		return (
			<div>
				<StatefulPicker
					width={this.props.width}
					orientation={this.props.orientation}
					wrap={this.props.wrap}
					joined={this.props.joined}
					noAnimation={this.props.noAnimation}
					disabled={this.props.disabled}
				>
					{this.state.children}
				</StatefulPicker>
				<div>
					<StatefulInput
						ref={(c) => {
							this.addInput = c;
						}} placeholder='Value'
					/>
					<Button onClick={this.handleAdd}>
						Add
					</Button>
				</div>
				<div>
					<StatefulInput
						ref={(c) => {
							this.removeInput = c;
						}} placeholder='Index'
					/>
					<Button onClick={this.handleRemove}>
						Remove
					</Button>
				</div>
			</div>
		);
	}
}

export default PickerAddRemove;
